import { TestDB } from '../../../components/TestDB';
import kafka from 'kafka-node';

export default async function handler(req, res) {

	// create a kafka client
	//const kafkaHost = process.env.NEXT_PUBLIC_KAFKA_SERVER;
	//const client = new kafka.KafkaClient({ kafkaHost });
	//const producer = new kafka.Producer(client);
	//const topic = "botcommands";

	if (req.method === 'GET') {
		// get the bots
		const testDB = new TestDB();
		const bots = await testDB.getBots();
		console.log(`bots: ${JSON.stringify(bots)}`);
		res.status(200).json(bots);
	}
}