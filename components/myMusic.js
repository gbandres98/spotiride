import React from "react";
import axios from "axios";

export default class MyMusic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      short_term: [],
      medium_term: [],
      long_term: [],
      loaded: false,
      selected: "short_term",
    };
  }

  componentDidMount = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    };

    const short_term = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
      config
    );

    const medium_term = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=medium_term",
      config
    );

    const long_term = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term",
      config
    );

    this.setState({
      short_term: short_term.data.items,
      medium_term: medium_term.data.items,
      long_term: long_term.data.items,
      loaded: true,
    });
  };

  changeHandler = (selected) => () => {
    this.setState({
      selected,
    });
    this.props.onChange(selected);
  };

  render = () => (
    <div>
      {this.state.loaded && (
        <div>
          <div
            className={
              this.state.selected === "short_term"
                ? "tracklist-selected"
                : "tracklist"
            }
            onClick={this.changeHandler("short_term")}
          >
            <h3>Últimos días:</h3>
            {this.state.short_term.map((track) => (
              <img className="album" src={track.album.images[0].url} />
            ))}
          </div>
          <div
            className={
              this.state.selected === "medium_term"
                ? "tracklist-selected"
                : "tracklist"
            }
            onClick={this.changeHandler("medium_term")}
          >
            <h3>Top reciente:</h3>
            {this.state.medium_term.map((track) => (
              <img className="album" src={track.album.images[0].url} />
            ))}
          </div>
          <div
            className={
              this.state.selected === "long_term"
                ? "tracklist-selected"
                : "tracklist"
            }
            onClick={this.changeHandler("long_term")}
          >
            <h3>Top global:</h3>
            {this.state.long_term.map((track) => (
              <img className="album" src={track.album.images[0].url} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
