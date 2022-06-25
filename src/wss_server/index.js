import WebSocket, { WebSocketServer } from 'ws';

import { commandsHandler } from './commandsHandler.js';

const WSS_PORT = 8080;
const WSS_URL = `wss://localhost:${WSS_PORT}`;

console.log(`Start WebSockets server on the ${WSS_URL}!`);
export const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('connection', (socket) => {
  console.log('Wss started');

  socket.on('message', (data) => commandsHandler(socket, data));
});

wss.on('error', (err) => {
  console.log(err);
});

wss.on('close', () => {
  console.log('Websocket server disconnected');
});
