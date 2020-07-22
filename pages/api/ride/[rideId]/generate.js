import nextConnect from "next-connect";
import middleware from "../../../../middleware/database";
import { ObjectId } from "mongodb";
import axios from "axios";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { token } = req.body;
  const { rideId } = req.query;

  const ride = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(rideId) });

  const userData = await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const userId = userData.data.id;

  const created = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      name: ride.name,
      description: `Playlist creada para ${ride.users.map(
        (user) => `${user.name} `
      )}por SpotiRide!`,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const playlistId = created.data.id;

  const trackUris = ride.tracks
    .sort((track1, track2) => track1.position - track2.position)
    .map((track) => track.uri);

  let index = 0;

  while (index <= trackUris.length) {
    let part = trackUris.slice(
      index,
      index + 100 > trackUris.length ? trackUris.length : index + 100
    );

    try {
      let asd = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        part,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(asd);
    } catch (e) {
      console.log(e);
    }

    console.log(asd);

    index += 100;
  }

  res.json({
    result: "ok",
  });
});

export default handler;
