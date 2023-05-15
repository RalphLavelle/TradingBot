import { MongoDB } from '../../../components/MongoDB';
import { authenticator } from 'otplib';

export default async function handler(req, res) {
	const { username, password, action } = req.query;
	const mongo = new MongoDB();

	if (req.method === 'GET') {
		if (password) {
			let query = { username };
			const { results, client } = await mongo.get("users", query, true);
			if(results) {
				if(results.password === password) {
					res.status(200).json({ success: true, user: {
						registered: results.registered,
						username: results.username,
						email: results.email
					} });
				} else {
					res.status(200).json({ success: false });
				}
			} else {
				res.status(200).json({ success: false });
			}
			client.close();
		}
	} else {
		if (action) {
			let query = { username };
			if (action === 'saveCode') {
				const { results, client } = await mongo.get("users", query, true);
				const code = JSON.parse(req.body).code;
				if(results) {
					results.code = code;
					await mongo.save("users", results,
						{ username: results.username }, // filter
						{ code: results.code, registered: true }, // fields to set
						true // upsert
					);
					res.status(200).json({ success: true });
				} else {
					res.status(200).json({ success: false });
				}
				client.close();
			}
			if (action === 'checkCode') {
				let body = JSON.parse(req.body);
				const code = body.code;
				const { results, client } = await mongo.get("users", query, true);
				if(results) {
					const isValid = authenticator.check(code, results.code);
					console.log(isValid);
					if (!isValid) {
						res.status(200).json({ success: false });
					} else {
						res.status(404).json({ success: true });
					}
				} else {
					res.status(200).json({ success: false });
				}
				client.close();
			}
		}
	}
}