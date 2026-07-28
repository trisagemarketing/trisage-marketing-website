const fs = require('fs');

// Read logo.png as base64
const logoBase64 = fs.readFileSync('public/logo.png').toString('base64');

// Create a high resolution 512x512 SVG with a pure white circle background badge (#ffffff)
// and outer transparent canvas!
const circleSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Outer area is transparent canvas -->
  <!-- Pure white circle badge in the center -->
  <circle cx="256" cy="256" r="236" fill="#ffffff" stroke="#e5e7eb" stroke-width="4" />
  <!-- Centered logo inside white circle -->
  <image href="data:image/png;base64,${logoBase64}" x="76" y="76" width="360" height="360" preserveAspectRatio="xMidYMid meet" />
</svg>`;

fs.writeFileSync('public/icon.svg', circleSvg);
fs.writeFileSync('public/logo.svg', circleSvg);
console.log('Successfully created public/icon.svg with pure white circle badge and transparent outer background!');
