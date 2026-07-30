const sharp = require('sharp');

async function checkTrim() {
  const files = ['public/transparent_logo.png', 'public/logo.png', 'scratch/emblem_raw.png', 'public/icon.png'];
  for (const f of files) {
    try {
      const trimmed = await sharp(f).trim().toBuffer({ resolveWithObject: true });
      console.log(`${f} -> Trimmed Bounding Box: ${trimmed.info.width}x${trimmed.info.height} (Aspect ratio: ${(trimmed.info.width / trimmed.info.height).toFixed(2)})`);
    } catch(e) {
      console.error(f, e.message);
    }
  }
}

checkTrim();
