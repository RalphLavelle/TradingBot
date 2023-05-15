const { MongoClient } = require("mongodb");

export class MongoDB {

    connect = async collectionName => {
		const username = "monitoringUser";
		const password = process.env.NEXT_PUBLIC_DB_PASSWORD;
        const connectionString = `mongodb+srv://${username}:${password}@${process.env.NEXT_PUBLIC_DB_CLUSTER}`;
        const client = new MongoClient(connectionString);
        await client.connect();
        const collection = client.db(process.env.NEXT_PUBLIC_DB_NAME).collection(collectionName);
        return { client, collection };
    }

	get = async (collectionName, query, single) => {
        const { client, collection } = await this.connect(collectionName);
        let results = await collection.find(query).toArray();
        if (!results) {
            results = [];
        }
        if (single) {
            if(results.length === 0) {
                results = null;
            } else if (results.length === 1) {
                results = results[0];
            }
        }
        return { results, client };
    }

    save = async (coll, filter, fields, upsert) => {
        const mongo = new MongoDB();
		const { client, collection } = await mongo.connect(coll);
        if(upsert) {
		    await collection.updateOne(filter, { $set: fields}, { upsert });
        } else {
            await collection.insertOne(fields);
        }
		client.close();
    }
}