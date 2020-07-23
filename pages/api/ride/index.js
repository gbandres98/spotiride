import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import axios from "axios";
import { createPlaylist, getUserData } from "../../../util/spotify";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { name, token } = req.body;

  const userData = await getUserData(token);

  const created = await createPlaylist(name, userData.display_name);

  let doc = await req.db.collection("rides").insertOne({
    name,
    users: [],
    tracks: [],
    playlistId: created.id,
    playlistUrl: created.external_urls.spotify,
  });

  res.json(doc.ops[0]);
});

handler.get(async (req, res) => {
  const { token } = req.headers;

  const userData = await getUserData(token);

  let doc = await req.db
    .collection("rides")
    .find({
      "users.id": userData.id,
    })
    .toArray();

  res.json(doc);
});

export default handler;
