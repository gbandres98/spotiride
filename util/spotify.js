import axios from "axios";
import qs from "qs";

export const getSpotirideToken = async () => {
  const body = {
    grant_type: "refresh_token",
    refresh_token: process.env.SPOTIFY_API_SPOTIRIDE_REFRESH_TOKEN,
  };

  const config = {
    headers: {
      Authorization: `Basic ${process.env.SPOTIFY_API_BASE64_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify(body),
    config
  );

  return response.data.access_token;
};

export const getUserData = async (token) => {
  const userData = await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return userData.data;
};

export const createPlaylist = async (playlistName, userName) => {
  const spotirideToken = await getSpotirideToken();

  try {
    const created = await axios.post(
      `https://api.spotify.com/v1/users/${process.env.SPOTIFY_API_SPOTIRIDE_USER_ID}/playlists`,
      {
        name: playlistName,
        description: `Playlist creada para ${userName} por SpotiRide!`,
        public: false,
        collaborative: true,
      },
      {
        headers: {
          Authorization: `Bearer ${spotirideToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return created.data;
  } catch (e) {
    console.log(e);
  }
};

export const getTopTracks = async (type, token) => {
  const spotifyData = await axios.get(
    `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${type}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return spotifyData.data.items;
};

export const emptyPlaylist = async (playlistId) => {
  const spotirideToken = await getSpotirideToken();

  while (true) {
    let response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${spotirideToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.items.length === 0) break;

    const oldTracks = response.data.items.map((element) => ({
      uri: element.track.uri,
    }));

    await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${spotirideToken}`,
          "Content-Type": "application/json",
        },
        data: { tracks: oldTracks },
      }
    );
  }
};

export const addTracksToPlaylist = async (playlistId, tracks) => {
  const spotirideToken = await getSpotirideToken();

  const trackUris = tracks
    .sort((track1, track2) => track1.position - track2.position)
    .map((track) => track.uri);

  let index = 0;
  try {
    while (index < trackUris.length) {
      let part = trackUris.slice(
        index,
        index + 100 > trackUris.length ? trackUris.length : index + 100
      );

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        part,
        {
          headers: {
            Authorization: `Bearer ${spotirideToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      index += 100;
    }
  } catch (e) {
    console.log(e);
  }
};
