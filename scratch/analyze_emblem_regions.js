const sharp = require('sharp');

async function analyzeRegions() {
  const image = sharp('public/transparent_logo.png');
  const trimmed = await image.trim().toBuffer({ resolveWithObject: true });
  const { data, info } = await sharp(trimmed.data).raw().toBuffer({ resolveWithObject: true });

  console.log(`Trimmed dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Divide into top 75% and bottom 25% to see where non-transparent pixels are concentrated
  let topAlphaCount = 0;
  let bottomAlphaCount = 0;
  const splitY = Math.floor(info.height * 0.75);

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const alpha = info.channels === 4 ? data[idx + 3] : 255;
      if (alpha > 20) {
        if (y < splitY) topAlphaCount++;
        else bottomAlphaCount++;
      }
    }
  }

  console.log(`Top 75% solid pixel count: ${topAlphaCount}`);
  console.log(`Bottom 25% solid pixel count: ${bottomAlphaCount}`);
}

analyzeRegions();
