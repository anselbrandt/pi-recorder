const { spawn } = require("child_process");
const LCDPLATE = require("adafruit-pi-lcd");
const lcd = new LCDPLATE(1, 0x20);

arOptions = {
  channels: 2,
  rate: 44100,
  format: "S24_3LE",
  device: "front:CARD=Pro70787723", // find out with `arecord -L`
};

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

const callback = function (level) {
  const value = (level / 100) * 75;
  const message = numToBlocks(value).padEnd(15, " ");
  const topLine = "L" + message;
  const bottomLine = "R" + message;
  lcd.home();
  lcd.message(topLine + "\n" + bottomLine);
};

const arProcess = spawn(
  "arecord",
  [
    "-c",
    arOptions.channels,
    "-r",
    arOptions.rate,
    "-f",
    arOptions.format,
    "-D",
    arOptions.device,
    "-V",
    "mono",
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

arProcess.stderr.on("data", function (data) {
  let level = parseInt(String(data).substr(54, 2));
  if (isNaN(level)) {
    // Recording WAVE 'stdin' : Signed 24 bit Little Endian in 3bytes, Rate 44100 Hz, Stereo\n
    const message = String(data);
    if (
      message !==
      "Recording WAVE 'stdin' : Signed 24 bit Little Endian in 3bytes, Rate 44100 Hz, Stereo\n"
    ) {
      const message = "Over".padStart(15, " ");
      const topLine = "L" + message;
      const bottomLine = "R" + message;
      lcd.home();
      lcd.message(topLine + "\n" + bottomLine);
    }
    return;
  }
  callback(level);
});
