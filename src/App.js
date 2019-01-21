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

function ChatList(selectedUser, messages) {
  let currentMessageViewItems = [];
  messages.map(item => {
    if (
      selectedUser.local === item.from.local ||
      selectedUser.local === item.to.local
    ) {
      currentMessageViewItems = [...currentMessageViewItems, item];
    }
  });
  return currentMessageViewItems;
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unameVal: "",
      passVal: "",
      messageVal: "",
      selectedUser: "",
      logged: false,
      messages: [],
      listedMessages: [],
      availableMessages: [],
      roster: [
        {
          jid: "",
          status: false
        }
      ]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
    this.handleSelectUserClick = this.handleSelectUserClick.bind(this);
    this.unload = this.unload.bind(this);
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.unload);
  }
  componentWillMount() {
    window.addEventListener("beforeunload", this.unload);
  }
  unload(event) {
    if (this.state.logged) {
      this.client.disconnect();
      this.setState({
        logged: false
      });
    }
  }

  handleLoginClick(event) {
    event.preventDefault();
    this.client = XMPP.createClient({
      jid: this.state.unameVal + "@example.com",
      password: this.state.passVal,
      transport: "bosh",
      boshURL: "http://127.0.0.1:7070/http-bind",
      sasl: "plain",
      resource: "web"
    });

    this.client.on("presence", presence => {
      let currentRoster = this.state.roster;
      const precenceFromJID = presence.from.local;
      const precenceFromType = presence.type;
      const index = this.state.roster.findIndex(x => x.jid === precenceFromJID);
      if (precenceFromType === "available") {
        currentRoster[index].status = true;
      } else {
        currentRoster[index].status = false;
      }
      this.setState({
        roster: currentRoster
      });
    });

    this.client.on("session:started", () => {
      this.client.getRoster((err, res) => {
        if (res) {
          //for status
          let roster = [];
          for (let i = 0; i < res.roster.items.length; i++) {
            roster = [
              ...roster,
              {
                jid: res.roster.items[i].jid.local,
                status: false
              }
            ];
          }
          this.setState({
            roster: roster
          });
          roster = [];
          //for status
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
      console.log("disconnected");
    });
    this.client.on("message", message => {
      this.setState(prev => ({
        messages: [
          ...prev.messages,
          {
            to: "",
            from: message.from.local,
            body: message.body,
            date: Date.now(),
            sender: false
          }
        ]
      }));
    });
    this.client.connect();
  }
  handleSendClick(event) {
    event.preventDefault();

    const selectedUser = event.target.value;
    const listedMessages = ChatList(selectedUser, this.state.messages);
    const receivedPromiseData = new Promise((resolve, reject) => {
      resolve("res");
      reject("rej");
    });

    if (this.state.selectedUser !== "") {
      this.client.sendMessage({
        to: this.state.selectedUser + "@example.com",
        body: this.state.messageVal
      });
      receivedPromiseData
        .then(() => {
          this.setState(prev => ({
            messages: [
              ...prev.messages,
              {
                from: "",
                to: this.state.selectedUser,
                body: this.state.messageVal,
                date: Date.now(),
                sender: true
              }
            ]
          }));
        })
        .then(() => {
          this.setState({
            listedMessages: ChatList(
              this.state.selectedUser,
              this.state.messages
            )
          });
        })
        .then(() => {
          console.log("Gönderildi");
          console.table(this.state.listedMessages);
        });
      receivedPromiseData.catch(err => {
        console.log(err);
      });
    }
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

  handleSelectUserClick(event) {
    event.preventDefault();
    const selectedUser = event.target.value;
    const listedMessages = ChatList(selectedUser, this.state.messages);
    const receivedPromiseData = new Promise((resolve, reject) => {
      resolve("res");
      reject("rej");
    });
    receivedPromiseData.then(() => {
      this.setState({
        listedMessages: listedMessages,
        selectedUser: selectedUser
      });
      console.table(this.state.listedMessages);
    });
    receivedPromiseData.catch(err => {
      console.log(err);
    });
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
      <div className="grid-container">
        <div className="item4">
          <p style={{ textAlign: "center", textDecoration: "strong" }}>
            <b>{this.state.selectedUser}</b>
          </p>
        </div>
        <div className="item1">
          <ul>
            {this.state.roster.map(item => {
              return (
                <li key={item.jid}>
                  <Button
                    type={item.status ? "primary" : ""}
                    onClick={event => this.handleSelectUserClick(event)}
                    value={item.jid}
                  >
                    {item.jid}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="item3">
          <Input
            placeholder="Some words..."
            value={this.state.messageVal}
            onChange={event => this.handleChange(event, "message")}
          />
        </div>
        <div className="item2">
          <Button type="primary" onClick={event => this.handleSendClick(event)}>
            Send
          </Button>
          <Button
            type="primary"
            onClick={event => this.handleDisconnectClick(event)}
          >
            Disconnect
          </Button>
        </div>
      </div>
    );
    return this.state.logged ? chat : login;
  }
}
