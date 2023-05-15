import { MongoDB } from '../../../components/MongoDB';
import { IBot } from '../../../interfaces';

export default async function handler(req, res) {

	const mongo = new MongoDB();

	if (req.method === 'GET') {
		let query = { running: '1' };
		const { results, client } = await mongo.get("jobs", query, false);	
		
		// console.log(`bots[0]: ${JSON.stringify(results[0])}`);

		const bots = results.map(r => {
			let bot: IBot = {
				commandTopic: r.commandTopic,
				id: r._id,
				name: `${r.strategy}_${r.exchange}_${r.ticker}`,
				exchange: r.exchange,
				type: r.strategy, 
				token: r.token || r.ticker || "?",
				status: r.running == "1" ? "active" : "stopped",
				timeStarted: r.issueTime
			};
			return bot;
		});
		
		res.status(200).json(bots);
		client.close();
	}

	if (req.method === 'POST') {
		const newBot = JSON.parse(req.body);

		// change a few properties for the db
		newBot.strategy = newBot.type;
		newBot.issueTime = new Date();
		newBot.running = "1";
		delete newBot.type;

		console.log(`Saving new bot: ${JSON.stringify(newBot)}`);
		try {
			await mongo.save("jobs", {}, {
				...newBot
			}, false);
			res.status(200).json({ success: true});
		} catch(ex) {
			res.status(500).json({ success: false, message: ex.message });
		}
		
	}
}