import nextConnect from "next-connect";
import middleware from "../../../../middleware/database";
import { ObjectId } from "mongodb";
import axios from "axios";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { type, token } = req.body;
  const { rideId } = req.query;

  let ride = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(rideId) });

  const spotifyData = await axios.get(
    `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const userData = await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const tracks = spotifyData.data.items.map((track, index) => ({
    img: track.album.images[0],
    position: index,
    href: track.href,
    uri: track.uri,
    name: track.name,
    popularity: track.popularity,
    preview_url: track.preview_url,
    user: userData.data.id,
  }));

  ride.tracks = ride.tracks.filter((track) => track.user !== userData.data.id);
  ride.tracks.push(...tracks);

  ride.users = ride.users.filter((user) => user.id !== userData.data.id);
  ride.users.push({
    id: userData.data.id,
    name: userData.data.display_name,
  });

  await req.db
    .collection("rides")
    .findOneAndReplace({ _id: ObjectId(rideId) }, ride);

  while (true) {
    let response = await axios.get(
      `https://api.spotify.com/v1/playlists/${ride.playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.items.length === 0) break;

    const oldTracks = response.data.items.map((element) => ({
      uri: element.track.uri,
    }));

    await axios.delete(
      `https://api.spotify.com/v1/playlists/${ride.playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { tracks: oldTracks },
      }
    );
  }

  const trackUris = ride.tracks
    .sort((track1, track2) => track1.position - track2.position)
    .map((track) => track.uri);

  let index = 0;

  while (index <= trackUris.length) {
    let part = trackUris.slice(
      index,
      index + 100 > trackUris.length ? trackUris.length : index + 100
    );

    await axios.post(
      `https://api.spotify.com/v1/playlists/${ride.playlistId}/tracks`,
      part,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    index += 100;
  }

  const doc = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(req.query.rideId) });

  res.json(doc);
});

export default handler;
