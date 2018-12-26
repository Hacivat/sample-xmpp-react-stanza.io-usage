import React, { Component } from "react";
import XMPP from "stanza.io";


export class InputXMPP extends Component {
    constructor(props) {
      super(props);
      this.state = {
        messageValue: "",
        emailValue: "",
        loggedEmail: "",
        logged: false
      };
      this.handleClick = this.handleClick.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleEmailClick = this.handleEmailClick.bind(this);
      this.handleEmailChange = this.handleEmailChange.bind(this);
    }
    client = Object.Object;
    handleClick() {
      if (this.state.logged) {
        const message = this.state.messageValue;
        this.client.sendMessage({
          to: "user0@example.com",
          body: message
        });
      }
    }
  
    handleChange(event) {
      this.setState({
        messageValue: event.target.value
      });
    }
  
    handleEmailChange(event) {
      this.setState({
        emailValue: event.target.value
      });
    }
  
    handleEmailClick(event) {
      switch (event.target.value) {
        case "exit":
          this.client.disconnect();
          break;
        case "login":
          this.client = XMPP.createClient({
            jid: this.state.emailValue + "@example.com",
            password: "123123",
            transport: "bosh",
            boshURL: "http://127.0.0.1:7070/http-bind",
            sasl: "plain",
            resource: "web"
          });
          this.client.on("session:started", () => {
            this.setState({
              logged: true,
              loggedEmail: this.state.emailValue
            });
            console.log("connected");
            this.client.getRoster(() => {
              this.client.sendPresence();
            });
          });
  
          this.client.on("message", msg => {
            console.log(msg.body);
          });
  
          this.client.on("disconnected", xml => {
            console.log("disconected", xml);
          });
          this.client.connect();
          break;
        default:
      }
    }
  
    render() {
      return (
        <div>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
          <button onClick={this.handleEmailClick} value={"login"}>
            Giriş
          </button>
          <button onClick={this.handleEmailClick} value={"exit"}>
            Çıkış
          </button>
          <br />
          <br />
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button onClick={this.handleClick}>Gönder</button>
        </div>
      );
    }
  }
  