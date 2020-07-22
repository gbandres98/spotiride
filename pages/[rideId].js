import React from "react";
import axios from "axios";
import { withRouter } from "next/router";
import MyMusic from "../components/myMusic";

const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "d62061d804d64e119a0a13706e530e46";
const scopes = [
  "user-top-read",
  "playlist-modify-private",
  "playlist-modify-public",
];

class Ride extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ride: null,
      selected: "short_term",
      buttonText: "Añadir a la playlist",
      generateButtonText: "Crear playlist en mi Spotify",
    };

    this.addButtonRef = React.createRef();
  }

  componentDidMount = async () => {
    let token = localStorage.getItem("token");
    if (!token || !(await this.checkToken(token))) {
      localStorage.removeItem("token");
      window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${
        window.location.origin
      }&scope=${scopes.join("%20")}&state=${
        this.props.router.query.rideId
      }&response_type=token&show_dialog=true`;
    }

    this.fetchRideInfo();
  };

  fetchRideInfo = async () => {
    const rideId = this.props.router.query.rideId;

    const res = await axios.get(`${window.location.origin}/api/ride/${rideId}`);
    this.setState({
      ride: res.data,
    });
  };

  checkToken = async (token) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/", {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });
      return res.status !== 401;
    } catch {
      return false;
    }
  };

  handleTrackSelectionChange = (selected) => {
    this.setState({
      selected,
      buttonText: "Añadir a la playlist",
      generateButtonText: "Crear playlist en mi Spotify",
    });
  };

  addToRide = async () => {
    this.setState({ buttonText: "Añadiendo..." });

    await axios.post(
      `${window.location.origin}/api/ride/${this.state.ride._id}/add`,
      {
        type: this.state.selected,
        token: window.localStorage.getItem("token"),
      }
    );

    this.fetchRideInfo();

    this.setState({ buttonText: "Terminado!" });
  };

  generate = async () => {
    this.setState({ generateButtonText: "Generando..." });

    await axios.post(
      `${window.location.origin}/api/ride/${this.state.ride._id}/generate`,
      {
        token: window.localStorage.getItem("token"),
      }
    );

    this.fetchRideInfo();

    this.setState({ generateButtonText: "Terminado!" });
  };

  render = () => (
    <div>
      {this.state.ride && (
        <div>
          <h1>Playlist: {this.state.ride.name}</h1>
          Participantes:{" "}
          {this.state.ride.users.map((user) => (
            <span className="username" key={user.id}>
              {user.name}
            </span>
          ))}
          <h2>¿Qué música quieres añadir a la playlist?</h2>
          <MyMusic onChange={this.handleTrackSelectionChange} />
          <button onClick={this.addToRide}>{this.state.buttonText}</button>
          <button onClick={this.generate}>
            {this.state.generateButtonText}
          </button>
        </div>
      )}
    </div>
  );
}

export default withRouter(Ride);
