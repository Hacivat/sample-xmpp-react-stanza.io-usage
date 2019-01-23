import React, { Component } from "react";
import "./App.css";
import Client from "./global/client";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "glamor";
import Login from "./components/login";

export default class App extends Component {
  render() {
    return <Chat />;
  }
}

function ChatItems(selectedUser, messages) {
  let currentMessageViewItems = [];
  messages.map(item => {
    if (selectedUser === item.from || selectedUser === item.to) {
      currentMessageViewItems = [...currentMessageViewItems, item];
    } else return null;
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
      Client.client.disconnect();
      this.setState({
        logged: false
      });
    }
  }

  handleLoginClick(value) {
    this.setState({
      unameVal: value
    });
    Client.client.on("presence", presence => {
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

    Client.client.on("session:started", () => {
      Client.client.getRoster((err, res) => {
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
        Client.client.sendPresence();
        this.setState({
          logged: true
        });
      });
    });

    Client.client.on("disconnected", () => {
      console.log("disconnected");
    });
    Client.client.on("message", message => {
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
      this.setState({
        listedMessages: ChatItems(this.state.selectedUser, this.state.messages)
      });
    });
  }

  handleSendClick() {
    const receivedPromiseData = new Promise((resolve, reject) => {
      resolve("res");
      reject("rej");
    });

    if (this.state.selectedUser !== "") {
      Client.client.sendMessage({
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
            listedMessages: ChatItems(
              this.state.selectedUser,
              this.state.messages
            )
          });
        });
      receivedPromiseData.catch(err => {
        console.log(err);
      });
    }
  }

  handleDisconnectClick(event) {
    event.preventDefault();
    Client.client.disconnect();
    this.setState({
      logged: false,
      roster: []
    });
  }

  handleChange(param, type) {
    switch (type) {
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
    const listedMessages = ChatItems(selectedUser, this.state.messages);
    const receivedPromiseData = new Promise((resolve, reject) => {
      resolve("res");
      reject("rej");
    });
    receivedPromiseData.then(() => {
      this.setState({
        listedMessages: listedMessages,
        selectedUser: selectedUser
      });
    });
    receivedPromiseData.catch(err => {
      console.log(err);
    });
  }

  render() {
    const messageView = css({
      height: 200,
      width: 400
    });
    const chat = (
      <div className="grid-container">
        <div className="item4">
          <p style={{ textAlign: "center", textDecoration: "strong" }}>
            <b>{this.state.selectedUser}</b>
          </p>
          <ScrollToBottom className={messageView}>
            {this.state.selectedUser
              ? this.state.listedMessages.map(item => {
                  if (item.from === "") {
                    return (
                      <div key={item.date} style={{ marginRight: "20px" }}>
                        <p
                          style={{
                            textAlign: "right"
                          }}
                        >
                          <b>Siz; </b>
                        </p>
                        <p style={{ textAlign: "right" }}>{item.body}</p>
                      </div>
                    );
                  } else {
                    return (
                      <div key={item.date} style={{ marginRight: "20px" }}>
                        <p
                          style={{
                            textAlign: "right",
                            textDecoration: "strong"
                          }}
                        >
                          <b>{item.from}; </b>
                        </p>
                        <p style={{ textAlign: "right" }}>{item.body}</p>
                      </div>
                    );
                  }
                })
              : ""}
          </ScrollToBottom>
        </div>
        <div className="item1">
          <p style={{ textAlign: "center", textDecoration: "strong" }}>
            <b>{this.state.unameVal}</b>
          </p>
          <ul style={{ listStyleType: "none" }}>
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
                  <br />
                  <br />
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
    return this.state.logged ? (
      chat
    ) : (
      <Login onChange={value => this.handleLoginClick(value)} />
    );
  }
}
