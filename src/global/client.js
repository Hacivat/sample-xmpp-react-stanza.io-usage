import XMPP from "stanza.io";

class Client {
  constructor() {
    this.ConnectionToXMPP = this.ConnectionToXMPP.bind(this);
  }
  ConnectionToXMPP(JID_LOCAL, PASSWORD) {
    this.client = XMPP.createClient({
      jid: JID_LOCAL + "@example.com",
      password: PASSWORD,
      transport: "bosh",
      boshURL: "http://127.0.0.1:7070/http-bind",
      sasl: "plain",
      resource: "web"
    });
  }
}

export default new Client();
