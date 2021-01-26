const { spawn } = require("child_process");

arOptions = {
  channels: 2,
  rate: 44100,
  format: "S24_3LE",
  device: "front:CARD=Pro70787723", // find out with `arecord -L`
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
    "stereo",
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

arProcess.stderr.on("data", function (data) {
  const line = String(data);
  if (
    line !==
    "Recording WAVE 'stdin' : Signed 24 bit Little Endian in 3bytes, Rate 44100 Hz, Stereo\n"
  ) {
    const left = line.substr(36, 2);
    const right = line.substr(40, 2);
    console.log(left, right);
  }
});
