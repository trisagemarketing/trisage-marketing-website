const fs = require('fs');
const svg = fs.readFileSync('public/icon.svg', 'utf8');
const cleanSvg = svg.replace(/data:image\/png;base64,[^"']+/g, '[BASE64_DATA]');
console.log(cleanSvg);
