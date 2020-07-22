import nextConnect from "next-connect";
import middleware from "../../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { name } = req.body;
  let doc = await req.db.collection("rides").insertOne({
    name,
    users: [],
    tracks: [],
  });

  console.log(doc.ops[0]);
  res.json(doc.ops[0]);
});

export default handler;
