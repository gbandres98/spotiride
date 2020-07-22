import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import axios from "axios";

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

handler.get(async (req, res) => {
  const { authorization } = req.headers;

  const userData = await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      authorization,
    },
  });

  let doc = await req.db
    .collection("rides")
    .find({
      "users.id": userData.data.id,
    })
    .toArray();

  res.json(doc);
});

export default handler;
