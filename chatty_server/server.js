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

//to add uuid to every message then broadcast to all users
function handleMessage(data) {
  const message = JSON.parse(data)
  switch(message.type) {
    case "postMessage":
      message.id = uuid();
      message.type = "incomingMessage";
      console.log('Message received!!');
      break;
    case "postNotification":
      message.id = uuid();
      message.type = "incomingNotification";
      break;
  }
    broadcast(JSON.stringify(message));
}

function handleConnection(ws) {
  updateUserCount();
  assignColor();
  ws.on('message', handleMessage);
  ws.on('close', () => {
    updateUserCount();
  });
}
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
  const assignUserColor = {
    type: "colorNotification",
    userColor: getRandomColor()
  }
  console.log(assignUserColor.userColor);
  broadcast(JSON.stringify(assignUserColor));
}


wss.on('connection', handleConnection);
