import kafka from 'kafka-node';

export default async function handler(req, res) {
	
	// create a kafka client
	const kafkaHost = process.env.NEXT_PUBLIC_KAFKA_SERVER;
	const client = new kafka.KafkaClient({ kafkaHost });
	const producer = new kafka.Producer(client);
	const topic = "bot-commands";

	if (req.method === 'POST') {
		const { bot, command } = JSON.parse(req.body);

		console.log(`Executing ${command } on bot ${bot.id}.`);

		producer.on('ready', () => {
			const payloads = [
				{ topic, messages: 'start' }
			];
			producer.send(payloads, (err, data) => {
				if(err) {
					console.log('Error sending message to Kafka', err);
					res.status(200).json({ success: false });
				} else {
					console.log(`Success: ${JSON.stringify(data)}`);
					res.status(200).json({ success: true });
				}
			});
		});
	}
}