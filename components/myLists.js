import React from "react";
import axios from "axios";

export default class MyLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
    };
  }

  componentDidMount = async () => {
    const res = await axios.get(`${window.location.origin}/api/ride`, {
      headers: {
        token: `${localStorage.getItem("token")}`,
      },
    });

    this.setState({
      rides: res.data,
    });
  };

  render = () => (
    <div>
      <h3>Tus rides:</h3>
      {this.state.rides.map((ride) => (
        <div className="rideListElement">
          <a href={`${window.location.origin}/${ride._id}`}>{ride.name}</a>
        </div>
      ))}
    </div>
  );
}
