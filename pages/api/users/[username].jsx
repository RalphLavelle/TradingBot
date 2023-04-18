import { MongoDB } from '../../../components/MongoDB';
var postmark = require("postmark");

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
				res.status(404).json(false);
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

				// send the user an email
				let query = { username };
				const { results, client } = await mongo.get("users", query, true);
				const emailClient = new postmark.ServerClient(process.env.NEXT_PUBLIC_POSTMARK_API_TOKEN);

				console.log(`email: ${results.email}`);

				if(results) {
					emailClient.sendEmail({
						"From": process.env.NEXT_PUBLIC_POSTMARK_FROM_ADDRESS,
						"To": results.email,
						"Subject": "Bot Controller verification code",
						"HtmlBody": `Hello <strong>${results.username}</strong>, the Bot Controller verification code is ${code}`,
						"TextBody": `Hello ${results.username}, the Bot Controller verification code is ${code}`,
						"MessageStream": "outbound"
					});

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
	} else {
		// Process a POST request	
	}
}