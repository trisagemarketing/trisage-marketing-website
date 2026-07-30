const fs = require('fs');

function inspectPNG(filePath) {
  if (!fs.existsSync(filePath)) return console.log(filePath, 'does not exist');
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25]; // 6 is RGBA, 2 is RGB, 3 is Indexed, 0 is Grayscale
  console.log(filePath, `-> ${width}x${height}, BitDepth: ${bitDepth}, ColorType: ${colorType} (${colorType === 6 ? 'RGBA/Transparent' : 'Non-RGBA'})`);
}

inspectPNG('scratch/emblem_raw.png');
inspectPNG('public/transparent_logo.png');
inspectPNG('public/logo.png');
inspectPNG('public/icon.png');
