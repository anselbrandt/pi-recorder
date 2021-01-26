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
    "mono",
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

arProcess.stderr.on("data", function (data) {
  console.log(String(data));
  // let level = parseInt(String(data).substr(54, 2));
  // if (isNaN(level)) {
  //   console.log("Over");
  //   return;
  // }
});
