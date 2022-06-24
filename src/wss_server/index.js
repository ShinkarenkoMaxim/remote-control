import WebSocket, { WebSocketServer } from 'ws';
import robot from 'robotjs';

const WSS_PORT = 8080;

console.log(`Start Websockets server on the ${WSS_PORT} port!`);
const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('connection', (socket) => {
  console.log('Wss started');

  socket.on('message', (data) => {
    let answer = '';

    const parsedData = data.toString();
    const [command, value] = parsedData.split(' ');
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

    if (command.startsWith('draw_circle')) {
      const r = Number(value);
      const mouse = robot.getMousePos();

      robot.setMouseDelay(2);

      for (let i = 0; i <= Math.PI * 2; i += 0.01) {
        if (i > 0) {
          // For fix problem with first position
          robot.mouseToggle('down');
        }

        const x = mouse.x + r * Math.cos(i);
        const y = mouse.y + r * Math.sin(i);

        robot.dragMouse(x, y);
      }

      robot.mouseToggle('up');

      answer = command;
    }

    if (command.startsWith('draw_rectangle')) {
      const dimensions = parsedData.split(' ');
      const width = Number(dimensions[1]);
      const height = Number(dimensions[2]);

      robot.setMouseDelay(2);

      robot.mouseToggle('down');

      robot.moveMouseSmooth(x + width, y);
      robot.moveMouseSmooth(x + width, y - height);
      robot.moveMouseSmooth(x, y - height);
      robot.moveMouseSmooth(x, y);

      robot.mouseToggle('up');

      answer = command;
    }

    if (command.startsWith('draw_square')) {
      const side = Number(value);

      robot.setMouseDelay(2);

      robot.mouseToggle('down');

      robot.moveMouseSmooth(x + side, y);
      robot.moveMouseSmooth(x + side, y - side);
      robot.moveMouseSmooth(x, y - side);
      robot.moveMouseSmooth(x, y);

      robot.mouseToggle('up');

      answer = command;
    }

    socket.send(answer);
  });

  socket.send('something');
});

wss.on('message', (data) => {
  console.log(data);
});
