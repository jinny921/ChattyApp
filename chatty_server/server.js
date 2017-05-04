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

function handleMessage(data) {
  data = JSON.parse(data);
  data.id = uuid();
  console.log('Message received!!', data);
  broadcast(JSON.stringify(data));
  // broadcast(data);
  // parse
  // work with it...
  // stringify
  // and send (broadcast)
}

function handleConnection(client) {
  console.log('Client connected');
  client.on('message', handleMessage);
  // ws.on('close', () => console.log('Client disconnected'));
}

wss.on('connection', handleConnection);
