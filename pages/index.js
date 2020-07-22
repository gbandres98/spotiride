import React from "react";
import Router from "next/router";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "d62061d804d64e119a0a13706e530e46";
const scopes = [
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
];

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectUri: "",
    };
  }

  componentDidMount() {
    this.setState({
      redirectUri: window.location.origin,
    });

    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function (initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});

    console.log(hash);
    window.location.hash = "";

    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
      });

      localStorage.setItem("token", _token);

      if (hash.state) {
        Router.push(`/${hash.state}`);
      } else {
        Router.push("/play");
      }
    }
  }

  render = () => (
    <main>
      <h1 className="title">SpotiRide</h1>

      <p className="description">Lo de las playlists</p>

      {!this.state.token && (
        <a
          className="btn"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${
            this.state.redirectUri
          }&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login
        </a>
      )}
      {this.state.token && <div>Logged in!</div>}
    </main>
  );
}
