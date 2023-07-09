const MongoClient = require('mongodb').MongoClient;

const mongoConfig = {
  url: 'mongodb://0.0.0.0:27017',
  database: 'messages',
  collection: 'messages',
};

class MongodbController {
   
  async insertMessageToDB(message: string) {
      try {
        
        const client = await MongoClient.connect(mongoConfig.url);
        
        const db = client.db(mongoConfig.database);
        
        const collection = db.collection(mongoConfig.collection);

        await collection.insertOne({ message });

        client.close();

      } catch (error: any) {
         console.error('Error:', error.message);
      }
    }
}

const mongodbController = new MongodbController();

export default mongodbController;