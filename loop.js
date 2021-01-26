const LCDPLATE = require("adafruit-pi-lcd");
const lcd = new LCDPLATE(1, 0x20);

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

let i = (3 * Math.PI) / 2;

setInterval(() => {
  const sine = Math.sin(i);
  const value = (sine + 1) * 37.5;
  const message = numToBlocks(value).padEnd(15, " ");
  const topLine = "L" + message;
  const bottomLine = "R" + message;
  lcd.home();
  lcd.message(topLine + "\n" + bottomLine);
  i = i + 0.1;
}, 10);
