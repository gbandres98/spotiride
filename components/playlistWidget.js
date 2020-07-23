import React from "react";

export default class PlaylistWidget extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${this.props.playlistId}`}
      width="300"
      height="380"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
      key={this.props.refresh}
    ></iframe>
  );
}
