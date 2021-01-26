const LCDPLATE = require("adafruit-pi-lcd");
const lcd = new LCDPLATE(1, 0x20);

lcd.backlight(lcd.colors.OFF);
lcd.message("");
process.exit();
