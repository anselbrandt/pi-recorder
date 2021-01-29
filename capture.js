const AlsaCapture = require("alsa-capture");

const captureInstance = new AlsaCapture({
  channels: 2,
  debug: false,
  device: "front:CARD=Pro70787723",
  format: "S24_3LE",
  periodSize: 32,
  periodTime: undefined,
  rate: 44100,
});

// data is an Uint8Array
// Buffer size = numChannels * formatByteSize * periodSize
// Example: 2 Bytes (AlsaFormat.S24_LE) * 2 (numChannels) * 32 (periodSize) = 192 Bytes

let i = 0;

captureInstance.on("audio", (data) => {
  while (i < 1) {
    console.log(JSON.stringify(data));
  }
  i++;
  captureInstance.close();
});
