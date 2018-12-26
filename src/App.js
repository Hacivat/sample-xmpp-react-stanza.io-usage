import React, { Component } from "react";
import "./App.css";
import XMPP from "stanza.io";
import { Input, Button } from "antd";
import "antd/dist/antd.css";

export default class App extends Component {
  render() {
    return <Chat />;
  }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unameVal: "",
      passVal: "",
      messageVal: "",
      logged: false,
      roster: [],
      domain: "@example.com"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
    this.unload = this.unload.bind(this);
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.unload);
  }
  componentWillMount() {
    window.addEventListener("beforeunload", this.unload);
  }
  unload(event) {
    if(this.state.logged) {
      this.client.disconnect();
      this.setState({
        logged: false
      })
    }
  }

  handleLoginClick(event) {
    event.preventDefault();
    this.client = XMPP.createClient({
      jid: this.state.unameVal + this.state.domain,
      password: this.state.passVal,
      transport: "bosh",
      boshURL: "http://127.0.0.1:7070/http-bind",
      sasl: "plain",
      resource: "web"
    });

    this.client.on("session:started", () => {
      this.client.getRoster((err, res) => {
        if (res) {
          let roster = [];
          for (let i = 0; i < res.roster.items.length; i++) {
            roster.push(res.roster.items[i].jid.local);
          }
          this.setState({
            roster: roster
          });
          roster = [];
        }
        if (err) {
          console.log(err);
        }
        this.client.sendPresence();
        this.setState({
          logged: true
        });
      });
    });
    this.client.on("disconnected", () => {
      console.log("disconnnected");
    });
    this.client.connect();
  }
  handleSendClick(event) {
    event.preventDefault();
  }

  handleDisconnectClick(event) {
    event.preventDefault();
    this.client.disconnect();
    this.setState({
      logged: false,
      roster: []
    });
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
      case "message":
        this.setState({
          messageVal: param.target.value
        });
        break;
      default:
    }
  }
  render() {
    const inputStyle = {
      width: "200px",
      margin: "0 8px 8px 0",
      float: "right"
    };
    const rightButtonStyle = {
      float: "right"
    };
    const leftButtonStyle = {
      float: "left"
    };
    const boxStyle = {
      width: "200px",
      height: "200px",
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
      margin: "auto"
    };
    const userListStyle = {
      float: "left"
    };
    const login = (
      <div style={boxStyle}>
        <Input
          style={inputStyle}
          placeholder="Nickname..."
          value={this.state.unameVal}
          onChange={event => this.handleChange(event, "uname")}
        />
        <br />
        <Input
          style={inputStyle}
          placeholder="Password..."
          value={this.state.passVal}
          onChange={event => this.handleChange(event, "pass")}
        />
        <br />
        <Button
          type="primary"
          style={rightButtonStyle}
          onClick={event => this.handleLoginClick(event)}
        >
          Login
        </Button>
      </div>
    );

    const chat = (
      <div style={boxStyle}>
        <div style={userListStyle}>
          <ul />
        </div>

        <Input
          style={inputStyle}
          placeholder="Some words..."
          value={this.state.messageVal}
          onChange={event => this.handleChange(event, "message")}
        />
        <br />

        <Button
          type="primary"
          style={leftButtonStyle}
          onClick={event => this.handleDisconnectClick(event)}
        >
          Disconnect
        </Button>

        <Button
          type="primary"
          style={rightButtonStyle}
          onClick={event => this.handleSendClick(event)}
        >
          Send
        </Button>
      </div>
    );
    return this.state.logged ? chat : login;
  }
}
