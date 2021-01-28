const AlsaCapture = require("alsa-capture");
const LCDPLATE = require("adafruit-pi-lcd");
const lcd = new LCDPLATE(1, 0x20);

const captureInstance = new AlsaCapture({
  channels: 2,
  debug: false,
  device: "front:CARD=Pro70787723",
  format: "S24_3LE",
  periodSize: 32,
  periodTime: undefined,
  rate: 44100,
});

lcd.backlight(lcd.colors.ON);
lcd.createChar(0, [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10]);
lcd.createChar(1, [0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10]);
lcd.createChar(2, [0x1c, 0x1c, 0x1c, 0x1c, 0x1c, 0x1c, 0x1c, 0x1c]);
lcd.createChar(3, [0x1e, 0x1e, 0x1e, 0x1e, 0x1e, 0x1e, 0x1e, 0x1e]);

const numToBlocks = (number) => {
  const num = parseInt(number);
  const block = "\xff";
  const partial = ["\x00", "\x01", "\x02", "\x03"];
  const quot = parseInt(num / 5);
  const remain = num % 5;
  let string = "";
  if (remain !== 0) {
    string = block.repeat(quot) + partial[remain - 1];
  } else {
    string = block.repeat(quot);
  }
  return string;
};

// data is an Uint8Array
// Buffer size = numChannels * formatByteSize * periodSize
// Example: 2 Bytes (AlsaFormat.S16_LE) * 2 (numChannels) * 32 (periodSize) = 128 Bytes
let i = 0;
captureInstance.on("audio", (data) => {
  let left = [];
  for (let i = 0; i < data.length; i = i + 6) {
    left.push(data.slice(i, i + 3));
  }
  let right = [];
  for (let i = 3; i < data.length; i = i + 6) {
    right.push(data.slice(i, i + 3));
  }
  const leftLevels = left.map((entry) => ((entry[0] / 255) * 100).toFixed(0));
  const rightLevels = right.map((entry) => ((entry[0] / 255) * 100).toFixed(0));
  const topLine = "L" + numToBlocks(leftLevels).padEnd(15, " ");
  const bottomLine = "R" + numToBlocks(rightLevels).padEnd(15, " ");
  lcd.home();
  lcd.message(topLine + "\n" + bottomLine);
});
