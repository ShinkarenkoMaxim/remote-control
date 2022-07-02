import robot from 'robotjs';

export const mouseOperations = ({ command, value, mousePos }) => {
  const { x, y } = mousePos;
  let answer = command;

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

  if (command.startsWith('mouse_position')) {
    answer = `${command} ${x},${y}`;
  }

  return answer;
};
