import { MongoDB } from '../../../components/MongoDB';
import { IBot } from '../../../interfaces';

export default async function handler(req, res) {

	const mongo = new MongoDB();

	if (req.method === 'GET') {
		// get the bots
		let query = { running: '1' };
		const { results, client } = await mongo.get("jobs", query, false);	
		
		console.log(`bots[0]: ${JSON.stringify(results[0])}`);

		const bots = results.map(r => {
			let bot: IBot = {
				commandTopic: r.commandTopic,
				id: r._id,
				name: r._id,
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
}