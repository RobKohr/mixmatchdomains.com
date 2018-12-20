const config = require('./config');
const MongoClient = require('mongodb').MongoClient;
let db;
const loadDb = async () => {
  if (db) {
    return db;
  }
  try {
    const client = await MongoClient.connect(config.mongodbUrl, { useNewUrlParser: true });
    db = client.db(config.mongodbDbName)
    console.log('Mongo db connected')
  } catch (err) {
    Raven.captureException(err);
  }
  return db;
};

module.exports = loadDb;