import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

const ws = new WebSocket("ws://localhost:3001");

const dataObj = {
  currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
  messages: [
    {
      id: 1,
      username: 'Bob',
      content: 'Has anyone seen my marbles?',
    },
    {
      id: 2,
      username: 'Anonymous',
      content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
    }
  ]
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
    // setupApp();
  }
  setTimeout(() => {
    console.log('Simulating incoming message');
    const newMessage = {id: 3, username: 'Michelle', content: 'Hello there!'};
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})
    }, 3000);
  } 

  onNewMessage = (input) => {
    const newMessage = {id: this.newId, username: input.user, content: input.content};
    const messages = this.state.messages.concat(newMessage);
    this.setState({messages: messages});
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
