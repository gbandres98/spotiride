import React from "react";
import axios from "axios";
import Router from "next/router";
import MyLists from "./myLists";

export default class ChooseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
    };

    this.createRideFormRef = React.createRef();
    this.joinRideFormRef = React.createRef();
  }

  createRideForm = () => {
    this.setState({
      step: 1,
    });
  };

  joinRideForm = () => {
    this.setState({
      step: 2,
    });
  };

  createRide = async () => {
    const res = await axios.post(`${window.location.origin}/api/ride`, {
      name: this.createRideFormRef.current.value,
      token: localStorage.getItem("token"),
    });

    Router.push(`/${res.data._id}`);
  };

  joinRide = () => {
    Router.push(`/${this.joinRideFormRef.current.value}`);
  };

  render = () => (
    <div>
      {this.state.step === 0 && (
        <div className="createRideContainer">
          <button onClick={this.createRideForm}>Crear ride</button>
        </div>
      )}
      {this.state.step === 1 && (
        <div className="form">
          <label>Ponle un nombre:</label>
          <input ref={this.createRideFormRef} />
          <button onClick={this.createRide}>Crear ride</button>
        </div>
      )}
      {this.state.step === 2 && (
        <div className="form">
          <label>Introduce el código del ride:</label>
          <input ref={this.joinRideFormRef} />
          <button onClick={this.joinRide}>Unirse a ride</button>
          <button onClick={this.createRideForm}>Crear ride</button>
        </div>
      )}
      <MyLists />
    </div>
  );
}
