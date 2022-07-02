import robot from 'robotjs';
import { mouseOperations } from './operations/mouse.js';
import { drawOperations } from './operations/draw.js';
import { screenshotOperation } from './operations/screenshot.js';

export const commandsHandler = async (socket, data) => {
  let answer = '';

  const parsedData = data.toString();
  const [command, value] = parsedData.split(' ');
  const mousePos = robot.getMousePos();

  if (command.startsWith('mouse')) {
    answer = mouseOperations({ command, value, mousePos });
  }

  if (command.startsWith('draw')) {
    answer = drawOperations({ parsedData, mousePos });
  }

  if (command.startsWith('prnt_scrn')) {
    answer = await screenshotOperation({ command, mousePos, size: 200 });
  }

  socket.send(answer);
};
