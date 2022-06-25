import robot from 'robotjs';

const drawSquareShapedFigure = ({ x, y, w, h }) => {
  robot.setMouseDelay(2);

  robot.mouseToggle('down');

  moveCursor({ x, y, w, h });

  robot.mouseToggle('up');
};

const moveCursor = ({ x, y, w, h }) => {
  robot.moveMouseSmooth(x + w, y);
  robot.moveMouseSmooth(x + w, y - h);
  robot.moveMouseSmooth(x, y - h);
  robot.moveMouseSmooth(x, y);
};

export const drawOperations = ({ parsedData, mousePos }) => {
  const { x, y } = mousePos;
  const [command, firstValue, secondValue] = parsedData.split(' ');
  const answer = command;

  if (command.startsWith('draw_circle')) {
    const r = parseFloat(firstValue);

    robot.setMouseDelay(2);

    for (let i = 0; i <= Math.PI * 2; i += 0.01) {
      if (i > 0) {
        // For fix problem with first position
        robot.mouseToggle('down');
      }

      const xAxis = x + r * Math.cos(i);
      const yAxis = y + r * Math.sin(i);

      robot.dragMouse(xAxis, yAxis);
    }

    robot.mouseToggle('up');
  }

  if (command.startsWith('draw_rectangle')) {
    const w = parseFloat(firstValue);
    const h = parseFloat(secondValue);

    drawSquareShapedFigure({ x, y, w, h });
  }

  if (command.startsWith('draw_square')) {
    const side = parseFloat(firstValue);

    drawSquareShapedFigure({ x, y, w: side, h: side });
  }

  return answer;
};
