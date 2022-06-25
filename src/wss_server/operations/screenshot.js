import robot from 'robotjs';
import Jimp from 'jimp';

export const screenshotOperation = async ({ command, mousePos, size }) => {
  const { x, y } = mousePos;
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
  const answer = command + ' ' + base64;

  return answer;
};
