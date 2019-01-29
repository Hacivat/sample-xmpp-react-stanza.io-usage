class Manipulator {
    constructor() {
        this.messageParser = this.messageParser.bind(this);
        this.chatItems = this.chatItems.bind(this);
        this.addReceiptToListedMessage = this.addReceiptToListedMessage.bind(this);
    }

    // ? when message income
    messageParser(className, message) {
        if (!message.hasOwnProperty("receipt")) {
            // console.log(message.id, "receipt")
            className.setState(prev => ({
                messages: [
                    ...prev.messages,
                    {
                        id: message.id,
                        to: "",
                        from: message.from.local,
                        body: message.body,
                        date: Date.now(),
                    }
                ]
            }));
            className.setState({
                listedMessages: this.chatItems(className.state.selectedUser, className.state.messages)
            });
        }
    }

    // ? message sent
    addReceiptToListedMessage(className, sendedMessage) {
        if (!sendedMessage.hasOwnProperty("receipt")) {
            // console.log(sendedMessage.id, "id sent");
            const receivedPromiseData = new Promise((resolve, reject) => {
                resolve("res");
                reject("rej");
            });
            receivedPromiseData
                .then(() => {
                    className.setState(prev => ({
                        messages: [
                            ...prev.messages,
                            {
                                id: sendedMessage.id,
                                from: "",
                                to: className.state.selectedUser,
                                body: className.state.messageVal,
                                date: Date.now()
                            }
                        ]
                    }));
                })
                .then(() => {
                    className.setState({
                        listedMessages: this.chatItems(
                            className.state.selectedUser,
                            className.state.messages
                        )
                    });
                });
            receivedPromiseData.catch(err => {
                console.log(err);
            });
        }
    }

    // ? listed messages
    chatItems(selectedUser, messages) {
        let currentMessageViewItems = [];
        messages.forEach(item => {
            if (selectedUser === item.from || selectedUser === item.to) {
                currentMessageViewItems = [...currentMessageViewItems, item];
            } else return null;
        });
        return currentMessageViewItems;
    }

}

export default new Manipulator();