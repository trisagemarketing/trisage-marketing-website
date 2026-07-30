const fs = require('fs');
const sharp = require('sharp');

async function inspectAll() {
  const files = ['public/transparent_logo.png', 'public/logo.png', 'scratch/emblem_raw.png', 'public/icon.png'];
  for (const f of files) {
    if (fs.existsSync(f)) {
      const meta = await sharp(f).metadata();
      const stats = await sharp(f).stats();
      console.log(`\n=== ${f} ===`);
      console.log(`Dimensions: ${meta.width}x${meta.height}, Format: ${meta.format}, Channels: ${meta.channels}, HasAlpha: ${meta.hasAlpha}`);
      console.log(`Stats alpha mean: ${stats.isOpaque ? 'Opaque (No Alpha)' : 'Transparent Alpha channel present'}`);
      console.log(`Channels stats min/max/mean:`);
      stats.channels.forEach((c, idx) => {
        console.log(`  Channel ${idx}: min=${c.min}, max=${c.max}, mean=${c.mean.toFixed(2)}`);
      });
    }
  }
}

inspectAll().catch(console.error);
