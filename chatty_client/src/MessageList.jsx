import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    return (
      <main className='messages'>
        {this.props.allMessages.map((message)  => {
          return (
            <Message 
              color={this.props.currentUserColor}
              message={message} 
              key={message.id}/>
            );
        })}
      </main>
      );
    }
  }

export default MessageList;