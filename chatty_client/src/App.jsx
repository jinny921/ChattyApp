import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const ws = new WebSocket("ws://localhost:3001");

const dataObj = {
  currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = dataObj;
    this.ws = ws;
  }

  get newId() {
    return this.id++;
  }

  componentDidMount() {
    console.log('componentDidMount <App />');

    this.ws.onopen = (evt) => {
      console.log('Established connection!', evt);
    }

    this.ws.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      console.log(msg);
      const messages = this.state.messages.concat(msg);
      this.setState({messages: messages});
    }
  } 


  onNewMessage = (input) => {
    const newMessage = {
      id: this.newId, 
      username: input.user, 
      content: input.content
    };
    this.ws.send(JSON.stringify(newMessage));
  }

  render() {
    return (
      <div>
          <NavBar />
          <MessageList allMessages={ this.state.messages }/>
          <ChatBar user={ this.state.currentUser.name } onNewMessage={ this.onNewMessage }/>
      </div>
    );
  }
}
export default App;
