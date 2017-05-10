import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


const dataObj = {
  currentUser: {
    name: 'Anonymous',
    color: 'black'
  }, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [],//user, username, color, content
  userCount: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = dataObj;
  }

  componentDidMount() {
    console.log('componentDidMount <App />');
    this.ws = new WebSocket("ws://localhost:3001");

    this.ws.onopen = (evt) => {
      console.log('Established connection!', evt);
    }

    this.ws.onmessage = (evt) => {
      let content = JSON.parse(evt.data);
      switch(content.type) {
        case "incomingMessage":
          //fall through to next case
        case "incomingNotification":
          this.setState({messages: this.state.messages.concat(content)});
        break;
        case "countNotification":
          this.setState({userCount: content.userNum});
          console.log(this.state.userCount);
        break;
        case "colorNotification":
          console.log(content.userColor);
          var newUser = this.state.currentUser;
          newUser.color = content.userColor;
          console.log('currentcolor', this.state.currentUser.color);
          this.setState({currentUser: newUser});
        break;
        default:
          throw new Error(`Unknown event type ${content.type}`);
      }
    }
  }

  userChecker = (username) => {
    return username === '' ? 'Anonymous' : username;
  }

  onNewMessage = (content) => {
    const newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: content.content,
      color: this.state.currentUser.color
    };
    console.log('newmsgObj',newMessage);
    this.ws.send(JSON.stringify(newMessage));
  }

  postNotification = (newUser) => {
    const oldUser = this.state.currentUser.name;
    if (oldUser !== newUser) {
      const changeName = {
        type: "postNotification",
        content: `${oldUser} has changed their name to ${newUser}`
      }
      this.setState({currentUser: {name: newUser, color:this.state.currentUser.color}});
      this.ws.send(JSON.stringify(changeName));
    }
  }

  render() {
    return (
      <div>
          <NavBar userCount={ this.state.userCount }/>
          <MessageList
            allMessages={ this.state.messages }/>
          <ChatBar
            currentUser={ this.state.currentUser.name}
            postNotification={ this.postNotification }
            onNewMessage={ this.onNewMessage }/>
      </div>
    );
  }
}
export default App;
