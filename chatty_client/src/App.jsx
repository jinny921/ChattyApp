import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';


const dataObj = {
  currentUser: {name: 'Anonymous'}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = dataObj;
  }

  get newId() {
    return this.id++;
  }

  componentDidMount() {
    console.log('componentDidMount <App />');
    this.ws = new WebSocket("ws://localhost:3001");

    this.ws.onopen = (evt) => {
      console.log('Established connection!', evt);
    }

    this.ws.onmessage = (evt) => {
      let newMsg = JSON.parse(evt.data);
        this.setState({messages: this.state.messages.concat(newMsg)});
    }
  } 

  userChecker = (username) => {
    return username === '' ? 'Anonymous' : username;
  }

  onNewMessage = (content) => {
    const newMessage = {
      type: "postMessage",
      id: this.newId, 
      username: this.state.currentUser.name, 
      content: content.content
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
          <NavBar />
          <MessageList allMessages={ this.state.messages }/>
          <ChatBar 
            currentUser={ this.state.currentUser.name}
            postNotification={ this.postNotification } 
            onNewMessage={ this.onNewMessage }/>
      </div>
    );
  }
}
export default App;
