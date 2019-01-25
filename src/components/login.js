import React, { Component } from "react";
import "../App.css";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import Client from "../global/client";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unameVal: "",
      passVal: "",
      clicked: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleChange(param, type) {
    switch (type) {
      case "uname":
        this.setState({
          unameVal: param.target.value
        });
        break;
      case "pass":
        this.setState({
          passVal: param.target.value
        });
        break;
      default:
    }
  }

  handleLoginClick() {
    Client.ConnectionToXMPP(this.state.unameVal, this.state.passVal);
    Client.client.connect();
    this.props.onChange(this.state.unameVal);
  }

  render() {
    return (
      <div className="box">
        <Input
          className="input"
          placeholder="Nickname..."
          value={this.state.unameVal}
          onChange={event => this.handleChange(event, "uname")}
        />
        <br />
        <Input
          className="input"
          placeholder="Password..."
          value={this.state.passVal}
          onChange={event => this.handleChange(event, "pass")}
        />
        <br />
        <Button
          type="primary"
          className="rightButton"
          onClick={event => this.handleLoginClick(event)}
        >
          Login
        </Button>
      </div>
    );
  }
}
