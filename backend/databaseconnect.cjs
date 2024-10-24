const { MongoClient } = require('mongodb');

// Replace the uri string with your MongoDB deployment's connection string.
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect()
    console.log("Connected to database")
    const database = client.db('chessGame');
    const users = database.collection('chessUsers');
    await createNewUser(database,'Alucard')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
async function createNewUser(db,username){
  const users = db.collection('chessUsers') 
  query = {'UID': new Date().getTime(),'userName':username}
  result = await users.insertOne(query)
  console.log(result)

}
run().catch(console.dir);

