import nextConnect from "next-connect";
import middleware from "../../../../middleware/database";
import { ObjectId } from "mongodb";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const doc = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(req.query.rideId) });

  res.json(doc);
});

export default handler;
