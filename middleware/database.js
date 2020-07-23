import { MongoClient } from "mongodb";
import nextConnect from "next-connect";

const client = new MongoClient(
  `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_NAME}0.eaous.mongodb.net/${process.env.MONGODB_COLLECTION}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.MONGODB_COLLECTION);
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
