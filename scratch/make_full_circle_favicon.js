const { execSync } = require('child_process');
const fs = require('fs');

// 1. Trim whitespace/borders around logo.png using sharp-cli trim
try {
  execSync('npx -y sharp-cli -i public/logo.png -o scratch/trimmed_logo.png trim 10');
  console.log('Trimmed logo successfully');
} catch (e) {
  console.error('Trim error:', e);
}

// 2. Read trimmed logo as base64
const logoBase64 = fs.readFileSync('scratch/trimmed_logo.png').toString('base64');

// 3. Create 512x512 SVG with pure white circle badge (#ffffff)
// and the emblem MAXIMIZED inside the circle (r=244, image size=420x420 centered at x=46, y=46)
const circleSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Pure white circle badge in the center -->
  <circle cx="256" cy="256" r="244" fill="#ffffff" stroke="#d1d5db" stroke-width="4" />
  <!-- Maximized centered emblem inside white circle -->
  <image href="data:image/png;base64,${logoBase64}" x="46" y="46" width="420" height="420" preserveAspectRatio="xMidYMid meet" />
</svg>`;

fs.writeFileSync('public/icon.svg', circleSvg);
console.log('Created high-visibility full-size emblem icon.svg');
