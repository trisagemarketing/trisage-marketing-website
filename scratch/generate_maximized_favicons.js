const fs = require('fs');
const sharp = require('sharp');

async function createMaximizedTransparentFavicon() {
  console.log('1. Extracting main logo emblem and trimming 100% of surrounding empty space...');
  
  // Get trimmed image
  const trimmed = await sharp('public/transparent_logo.png').trim().toBuffer({ resolveWithObject: true });
  
  // Crop only Blob 1 (top emblem y: 0 to 493)
  const emblemOnly = await sharp(trimmed.data)
    .extract({ left: 0, top: 0, width: trimmed.info.width, height: 493 })
    .trim() // tight trim right up to the exact pixel borders of the emblem
    .toBuffer({ resolveWithObject: true });

  console.log(`Tight emblem bounds: ${emblemOnly.info.width}x${emblemOnly.info.height}`);

  // Create a 512x512 square canvas with 0 padding (filling 100% of the icon box for maximum size in tabs)
  const targetSize = 512;

  // Scale emblem proportionally to fill the full 512x512 space
  const maxEmblem = await sharp(emblemOnly.data)
    .resize(targetSize, targetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  // Save 512x512 transparent PNG to public/icon.png
  fs.writeFileSync('public/icon.png', maxEmblem.data);
  console.log('Saved MAXIMIZED 512x512 transparent emblem PNG to public/icon.png (size:', maxEmblem.data.length, 'bytes)');

  // Save SVG version wrapping the 512x512 transparent PNG
  const base64Png = maxEmblem.data.toString('base64');
  const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- 100% Maximized transparent background main emblem logo -->
  <image href="data:image/png;base64,${base64Png}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync('public/icon.svg', svgContent);
  console.log('Saved MAXIMIZED transparent emblem SVG to public/icon.svg');

  // Generate 48x48 transparent icon for public/favicon.ico
  const ico48 = await sharp(maxEmblem.data)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync('public/favicon.ico', ico48);
  console.log('Saved MAXIMIZED 48x48 transparent icon at public/favicon.ico (size:', ico48.length, 'bytes)');
}

createMaximizedTransparentFavicon().catch(console.error);
