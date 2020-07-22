import { MongoClient } from "mongodb";
import nextConnect from "next-connect";

const client = new MongoClient(
  "mongodb+srv://spotiride:spotiridesecret@spotiride0.eaous.mongodb.net/spotiride?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db("spotiride");
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
