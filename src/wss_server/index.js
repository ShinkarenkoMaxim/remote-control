import WebSocket, { WebSocketServer } from 'ws';
import robot from 'robotjs';

const WSS_PORT = 8080;

console.log(`Start Websockets server on the ${WSS_PORT} port!`);
const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('connection', (socket) => {
  console.log('Wss started');

  socket.on('message', (data) => {
    let answer = '';
    const [command, value] = data.toString().split(' ');
    const { x, y } = robot.getMousePos();

    const mouseControlCommands = [
      'mouse_up',
      'mouse_down',
      'mouse_left',
      'mouse_right',
    ];

    if (mouseControlCommands.includes(command)) {
      if (command.startsWith('mouse_up')) {
        robot.moveMouse(x, y - Number(value));
      }

      if (command.startsWith('mouse_down')) {
        robot.moveMouse(x, y + Number(value));
      }

      if (command.startsWith('mouse_left')) {
        robot.moveMouse(x - Number(value), y);
      }

      if (command.startsWith('mouse_right')) {
        robot.moveMouse(x + Number(value), y);
      }

      answer = command;
    }

    if (command.startsWith('mouse_position')) {
      answer = `${command} ${x}, ${y}`;
    }

    socket.send(answer);
  });

  socket.send('something');
});

wss.on('message', (data) => {
  console.log(data);
});
