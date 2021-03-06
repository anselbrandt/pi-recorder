const LCDPLATE = require("adafruit-pi-lcd");
const lcd = new LCDPLATE(1, 0x20);
const midi = require("midi");
const { MidiMessage } = require("midi-message-parser");

const notes = [
  "C -1",
  "C#-1",
  "D -1",
  "Eb-1",
  "E -1",
  "F -1",
  "F#-1",
  "G -1",
  "G#-1",
  "A -1",
  "Bb-1",
  "B -1",
  "C 0",
  "C# 0",
  "D 0",
  "Eb 0",
  "E 0",
  "F 0",
  "F# 0",
  "G 0",
  "G# 0",
  "A 0",
  "Bb 0",
  "B 0",
  "C 1",
  "C# 1",
  "D 1",
  "Eb 1",
  "E 1",
  "F 1",
  "F# 1",
  "G 1",
  "G# 1",
  "A 1",
  "Bb 1",
  "B 1",
  "C 2",
  "C# 2",
  "D 2",
  "Eb 2",
  "E 2",
  "F 2",
  "F# 2",
  "G 2",
  "G# 2",
  "A 2",
  "Bb 2",
  "B 2",
  "C 3",
  "C# 3",
  "D 3",
  "Eb 3",
  "E 3",
  "F 3",
  "F# 3",
  "G 3",
  "G# 3",
  "A 3",
  "Bb 3",
  "B 3",
  "C 4",
  "C# 4",
  "D 4",
  "Eb 4",
  "E 4",
  "F 4",
  "F# 4",
  "G 4",
  "G# 4",
  "A 4",
  "Bb 4",
  "B 4",
  "C 5",
  "C# 5",
  "D 5",
  "Eb 5",
  "E 5",
  "F 5",
  "F# 5",
  "G 5",
  "G# 5",
  "A 5",
  "Bb 5",
  "B 5",
  "C 6",
  "C# 6",
  "D 6",
  "Eb 6",
  "E 6",
  "F 6",
  "F# 6",
  "G 6",
  "G# 6",
  "A 6",
  "Bb 6",
  "B 6",
  "C 7",
  "C# 7",
  "D 7",
  "Eb 7",
  "E 7",
  "F 7",
  "F# 7",
  "G 7",
  "G# 7",
  "A 7",
  "Bb 7",
  "B 7",
  "C 8",
  "C# 8",
  "D 8",
  "Eb 8",
  "E 8",
  "F 8",
  "F# 8",
  "G 8",
  "G# 8",
  "A 8",
  "Bb 8",
  "B 8",
  "C 9",
  "C# 9",
  "D 9",
  "Eb 9",
  "E 9",
  "F 9",
  "F# 9",
  "G 9",
];

lcd.backlight(lcd.colors.ON);

const input = new midi.Input();
// console.log(input.getPortCount());
const midiDevice = input.getPortName(3).split(":")[0];
lcd.message(midiDevice + "\n" + "Ready for MIDI");

input.on("message", (deltaTime, message) => {
  const parsed = new MidiMessage(message);
  const output = `${parsed.type}\n${parsed.channel} ${parsed.number} ${parsed.value}`;
  const note = notes[message[1]];
  lcd.clear();
  if (parsed.type === "noteon" || parsed.type === "noteoff") {
    lcd.message(`${parsed.type}\n${note}`);
  } else {
    lcd.message(output);
  }
});
input.openPort(3);
input.ignoreTypes(false, false, false);

// input.closePort();

lcd.on("button_change", function (button) {
  lcd.clear();
  lcd.message("Button changed:\n" + lcd.buttonName(button));
});
