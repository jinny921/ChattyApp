import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar">
            <a href="/" className="navbar-brand">Chatty</a>
            <div id="user-online">{this.props.userCount} users online</div>
        </nav>
      </div>
    );
  }
}

export default NavBar;