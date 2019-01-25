import React, { Component } from "react";
import "../App.css";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import { css } from "glamor";
import ScrollToBottom from "react-scroll-to-bottom";
import Client from "../global/client";

function ChatItems(selectedUser, messages) {
  let currentMessageViewItems = [];
  messages.map(item => {
    if (selectedUser === item.from || selectedUser === item.to) {
      currentMessageViewItems = [...currentMessageViewItems, item];
    } else return null;
  });
  return currentMessageViewItems;
}

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageVal: "",
      listedMessages: "",
      messages: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDisconnectClick = this.handleDisconnectClick.bind(this);
    this.handleSelectUserClick = this.handleSelectUserClick.bind(this);
    this.handleSendClick = this.handleSendClick.bind(this);
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

  handleDisconnectClick() {
    Client.client.disconnect();
    this.props.onChange("disconnected");
  }

  handleSelectUserClick(event) {
    event.preventDefault();
    const selectedUser = event.target.value;
    const listedMessages = ChatItems(selectedUser, this.props.messages);
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
              this.props.messages
            )
          });
        });
      this.props.onChange("sent");
      receivedPromiseData.catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    console.log(this.state.messages)
    const messageView = css({
      height: 200,
      width: 400
    });
    return (
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
            <b>{this.props.unameVal}</b>
          </p>
          <ul style={{ listStyleType: "none" }}>
            {this.props.roster.map(item => {
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
  }
}
