import { TestDB } from '../../../components/TestDB';

export default async function handler(req, res) {

	if (req.method === 'GET') {
		// get the bots
		const testDB = new TestDB();
		const bots = await testDB.getBots();
		console.log(`bots: ${JSON.stringify(bots)}`);
		res.status(200).json(bots);
	}
}