const sharp = require('sharp');

async function inspectRows() {
  const trimmed = await sharp('public/transparent_logo.png').trim().toBuffer({ resolveWithObject: true });
  const { data, info } = await sharp(trimmed.data).raw().toBuffer({ resolveWithObject: true });

  const rowCounts = [];
  for (let y = 0; y < info.height; y++) {
    let count = 0;
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const alpha = info.channels === 4 ? data[idx + 3] : 255;
      if (alpha > 20) count++;
    }
    rowCounts.push(count);
  }

  let inBlob = false;
  let blobStart = 0;
  const blobs = [];
  for (let y = 0; y < info.height; y++) {
    if (rowCounts[y] > 0 && !inBlob) {
      inBlob = true;
      blobStart = y;
    } else if (rowCounts[y] === 0 && inBlob) {
      inBlob = false;
      blobs.push({ start: blobStart, end: y - 1, height: y - blobStart });
    }
  }
  if (inBlob) {
    blobs.push({ start: blobStart, end: info.height - 1, height: info.height - blobStart });
  }

  console.log('Vertical Blobs (y-ranges containing non-transparent pixels):');
  blobs.forEach((b, i) => console.log(`Blob ${i + 1}: y = ${b.start} to ${b.end} (height: ${b.height}px)`));
}

inspectRows();
