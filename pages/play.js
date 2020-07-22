import ChooseList from "../components/chooseList";
import Router from "next/router";

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
    };
  }

  componentDidMount = async () => {
    // Check Spotify token
    let token = localStorage.getItem("token");
    if (!token || !(await this.checkToken(token))) {
      localStorage.removeItem("token");
      Router.push("/");
    } else {
      this.setState({
        token,
      });
    }
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

  logOut = () => {
    localStorage.removeItem("token");
    Router.push("/");
  };

  render = () => (
    <main>
      <h1 className="title">SpotiRide</h1>

      <p className="description">Lo de las playlists</p>

      <ChooseList />

      <button onClick={this.logOut}>Cerrar sesión</button>
    </main>
  );
}
