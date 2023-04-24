import { MongoDB } from '../../../components/MongoDB';

export default async function handler(req, res) {
	const { username, password, code, action } = req.query;
	const mongo = new MongoDB();

	if (req.method === 'GET') {
		if (password) {
			let query = { username };
			const { results, client } = await mongo.get("users", query, true);
			if(results) {
				if(results.password === password) {
					res.status(200).json(true);
				} else {
					res.status(200).json(false);
				}
			} else {
				res.status(200).json(false);
			}
			client.close();
		}
		if (action) {
			if (action === 'generateCode') {
				const code = Math.floor(100000 + Math.random() * 900000);
				const user = {
					username,
					code
				};

				let query = { username };
				const { results, client } = await mongo.get("users", query, true);

				if(results) {
					// save this to the db for this user
					await mongo.save(user);
					res.status(200).json(true);
				} else {
					res.status(404).json(false);
				}
				client.close();
			}
		}
		if (code) {
			let query = { username };
			const { results, client } = await mongo.get("users", query, true);
			console.log(`results: ${JSON.stringify(results)}`);
			if(results) {
				if(results.code == code) {
					res.status(200).json(true);
				} else {
					res.status(404).json(false);
				}
			} else {
				res.status(404).json(false);
			}
			client.close();
		}
	}
}