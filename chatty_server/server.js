const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');

const PORT = 3001;

const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


function broadcast(data) {
  for(let client of wss.clients) {
    client.send(data);
  }
}


function handleConnection(ws) {
  updateUserCount();
  assignColor(ws);

  function handleMessage(data) {
    const message = JSON.parse(data)
    switch(message.type) {
      case "postMessage":
        message.id = uuid();
        message.type = "incomingMessage";
        break;
      case "postNotification":
        message.id = uuid();
        message.type = "incomingNotification";
        break;
        default:
            throw new Error(`Unknown event type ${message.type}`);
    }
      broadcast(JSON.stringify(message));
  }
  ws.on('message', handleMessage);
  ws.on('close', () => {
    updateUserCount();
  });
}
wss.on('connection', handleConnection);

function updateUserCount() {
  const userCountUpdate = {
    type: "countNotification",
    userNum: wss.clients.size
  }
  broadcast(JSON.stringify(userCountUpdate));
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function assignColor(client) {
  const userColor = getRandomColor();
  const assignUserColor = {
    type: "colorNotification",
    userColor: userColor
  };
  client.send(JSON.stringify(assignUserColor));
}


