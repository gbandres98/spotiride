import nextConnect from "next-connect";
import middleware from "../../../../middleware/database";
import { ObjectId } from "mongodb";
import axios from "axios";
import {
  getTopTracks,
  getUserData,
  emptyPlaylist,
  addTracksToPlaylist,
} from "../../../../util/spotify";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { type, token } = req.body;
  const { rideId } = req.query;

  let ride = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(rideId) });

  const topTracks = await getTopTracks(type, token);

  const userData = await getUserData(token);

  const tracks = topTracks.map((track, index) => ({
    img: track.album.images[0],
    position: index,
    href: track.href,
    uri: track.uri,
    name: track.name,
    popularity: track.popularity,
    preview_url: track.preview_url,
    user: userData.id,
  }));

  ride.tracks = ride.tracks.filter((track) => track.user !== userData.id);
  ride.tracks.push(...tracks);

  ride.users = ride.users.filter((user) => user.id !== userData.id);
  ride.users.push({
    id: userData.id,
    name: userData.display_name,
  });

  await req.db
    .collection("rides")
    .findOneAndReplace({ _id: ObjectId(rideId) }, ride);

  await emptyPlaylist(ride.playlistId);

  await addTracksToPlaylist(ride.playlistId, ride.tracks);

  const doc = await req.db
    .collection("rides")
    .findOne({ _id: ObjectId(req.query.rideId) });

  res.json(doc);
});

export default handler;
