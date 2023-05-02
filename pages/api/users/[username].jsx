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

				const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
				const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
				const fromNumber = '+61413634494';
				const toNumber = '+61413634494';

				const twilioClient = require('twilio')(accountSid, authToken);

				try {
					await twilioClient.messages.create({
						body: "Testing testing...",
						from: fromNumber,
						to: toNumber
					}).then(message => {
						console.log(`Message sent: ${message.sid}`);
						res.status(200).json({ success: true });
					});
				} catch (ex) {
					console.log(`Error: ${ex}`);
					const error = `Error sending message: ${ex.message}`;
					res.status(200).json({  success: false, error });
				}
				res.status(200).json({ success: true });
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
			res.status(200).json(true);
			client.close();
		}
	}
}