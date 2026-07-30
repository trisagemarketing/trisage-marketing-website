const fs = require('fs');
const svg = fs.readFileSync('public/icon.svg', 'utf8');
const match = svg.match(/data:image\/png;base64,([^"']+)/);
if (match) {
  const buf = Buffer.from(match[1], 'base64');
  fs.writeFileSync('scratch/emblem_raw.png', buf);
  console.log('Saved raw base64 image to scratch/emblem_raw.png, size:', buf.length);
} else {
  console.log('No base64 image found');
}
