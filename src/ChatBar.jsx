import React, {Component} from 'react';

class ChatBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      content: ''
    };
  }
  
  changeMessage = (e) => {
  this.setState({content: e.target.value}); 
  }

  changeUser = (e) => {
    this.setState({username: e.target.value});
  }

  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.onNewMessage({user:this.state.username, content: this.state.content});
      this.setState({
        username: '',
        content: ''
      });
    }
  }

  render() {
    return (
      <footer className="chatbar">
          <input 
            className="chatbar-username" 
            placeholder="You're username" 
            onChange={ this.changeUser } 
            value={ this.state.username }/>
          <input 
            className="chatbar-message" 
            placeholder="Type a message and hit ENTER" 
            onChange={ this.changeMessage } 
            value={ this.state.content } 
            onKeyPress={ this.onEnter }/>
      </footer>
    );
  }
}

export default ChatBar;