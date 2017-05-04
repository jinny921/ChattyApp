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
    console.log('Message received!!', message);
      break;
    case "postNotification":
    message.id = uuid();
    message.type = "incomingNotification";
      break;
  }
    broadcast(JSON.stringify(message));
}

function handleConnection(client) {
  console.log('Client connected');
  client.on('message', handleMessage);
  // ws.on('close', () => console.log('Client disconnected'));
}

wss.on('connection', handleConnection);
