import React, {Component} from 'react';

class Message extends Component {
  render() {
    if ( this.props.message.type === "incomingMessage") {
      return (
          <div>
            <div className="message">
                <span className="message-username" style={{color: this.props.message.color}}>{this.props.message.username}</span>
                <span className="message-content">{this.props.message.content}</span>
              </div>
          </div>
        );
    } else if ( this.props.message.type === "incomingNotification"){
        return (
          <div className="message system">
            {this.props.message.content}
          </div>
        )      
      }
  }
}

export default Message;
