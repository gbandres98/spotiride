import nextConnect from "next-connect";
import middleware from "../../../middleware/database";
import axios from "axios";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { name, token } = req.body;

  const userData = await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userId = userData.data.id;

  const created = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: name,
      description: `Playlist creada para ${userData.data.display_name} por SpotiRide!`,
      public: false,
      collaborative: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const playlistId = created.data.id;

  let doc = await req.db.collection("rides").insertOne({
    name,
    users: [],
    tracks: [],
    playlistId: playlistId,
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
