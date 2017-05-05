import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


const dataObj = {
  currentUser: {
    name: 'Anonymous',
    color: 'black'
  }, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [],
  userCount: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = dataObj;
  }

  componentWillMount() {
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
        break;
        case "colorNotification":
          console.log(content.userColor);
          this.state.currentUser.color = content.userColor;
          this.setState({currentUser: this.state.currentUser});
      }
    }
  } 

  userChecker = (username) => {
    return username === '' ? 'Anonymous' : username;
  }

  onNewMessage = (content) => {
    const newMessage = {
      type: "postMessage",
      id: this.id, 
      username: this.state.currentUser.name, 
      content: content.content,
      color: this.state.currentUser.color
    };
    this.ws.send(JSON.stringify(newMessage));
  }

  postNotification = (newUser) => {
    const oldUser = this.state.currentUser.name;
    if (oldUser !== newUser) {
      const changeName = {
        type: "postNotification",
        content: `${oldUser} has changed their name to ${newUser}`
      }
      this.setState({currentUser: {name: newUser}});
      this.ws.send(JSON.stringify(changeName));
    }
  }

  render() {
    return (
      <div>
          <NavBar userCount={ this.state.userCount }/>
          <MessageList 
            allMessages={ this.state.messages }
            currentUserColor={ this.state.currentUser.color }/>
          <ChatBar 
            currentUser={ this.state.currentUser.name}
            postNotification={ this.postNotification } 
            onNewMessage={ this.onNewMessage }/>
      </div>
    );
  }
}
export default App;
