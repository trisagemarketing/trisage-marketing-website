const fs = require('fs');
const sharp = require('sharp');

async function createTransparentFavicon() {
  console.log('1. Extracting Blob 1 (main logo emblem without text) from public/transparent_logo.png...');
  
  // Get trimmed image
  const trimmed = await sharp('public/transparent_logo.png').trim().toBuffer({ resolveWithObject: true });
  
  // Crop only Blob 1 (y: 0 to 493)
  const emblemOnly = await sharp(trimmed.data)
    .extract({ left: 0, top: 0, width: trimmed.info.width, height: 493 })
    .trim() // trim tight around the emblem
    .toBuffer({ resolveWithObject: true });

  console.log(`Extracted emblem size: ${emblemOnly.info.width}x${emblemOnly.info.height}`);

  // Create a 512x512 transparent square canvas with emblem centered and padded nicely
  const targetSize = 512;
  const padding = 28; // 28px padding for clean framing
  const maxDim = targetSize - padding * 2; // 456px max width/height

  // Scale emblem proportionally to fit within 456x456
  const scaledEmblem = await sharp(emblemOnly.data)
    .resize(maxDim, maxDim, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  // Composite onto 512x512 transparent background
  const finalPng512 = await sharp({
    create: {
      width: targetSize,
      height: targetSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([{
    input: scaledEmblem.data,
    gravity: 'center'
  }])
  .png()
  .toBuffer();

  // Save 512x512 transparent PNG to public/icon.png
  fs.writeFileSync('public/icon.png', finalPng512);
  console.log('Saved 512x512 transparent emblem PNG to public/icon.png (size:', finalPng512.length, 'bytes)');

  // Save SVG version wrapping the 512x512 transparent PNG
  const base64Png = finalPng512.toString('base64');
  const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Transparent background main emblem logo without text -->
  <image href="data:image/png;base64,${base64Png}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>`;
  fs.writeFileSync('public/icon.svg', svgContent);
  console.log('Saved transparent emblem SVG to public/icon.svg');

  // Generate 48x48 transparent icon for public/favicon.ico
  const ico48 = await sharp(finalPng512)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync('public/favicon.ico', ico48);
  console.log('Saved 48x48 transparent PNG icon at public/favicon.ico (size:', ico48.length, 'bytes)');
}

createTransparentFavicon().catch(console.error);
