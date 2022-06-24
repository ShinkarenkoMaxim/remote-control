import WebSocket, { WebSocketServer } from 'ws';
import robot from 'robotjs';
import Jimp from 'jimp';

const WSS_PORT = 8080;

console.log(`Start Websockets server on the ${WSS_PORT} port!`);
const wss = new WebSocketServer({ port: WSS_PORT });

wss.on('connection', (socket) => {
  console.log('Wss started');

  socket.on('message', async (data) => {
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

    if (command.startsWith('prnt_scrn')) {
      const size = 200;
      const screenshot = robot.screen.capture(x, y, size, size);

      const width = screenshot.byteWidth / screenshot.bytesPerPixel; // width is sometimes wrong! Link on Issue https://github.com/octalmage/robotjs/issues/13
      const height = screenshot.height;

      let red, green, blue;
      const image = new Jimp(width, height);
      screenshot.image.forEach((byte, i) => {
        switch (i % 4) {
          case 0:
            return (blue = byte);
          case 1:
            return (green = byte);
          case 2:
            return (red = byte);
          case 3:
            image.bitmap.data[i - 3] = red;
            image.bitmap.data[i - 2] = green;
            image.bitmap.data[i - 1] = blue;
            image.bitmap.data[i] = 255;
        }
      });

      const base64Image = await image.getBase64Async('image/png');
      const base64 = base64Image.split(',')[1];

      answer = command + ' ' + base64;
    }

    socket.send(answer);
  });

  socket.send('something');
});

wss.on('message', (data) => {
  console.log(data);
});
