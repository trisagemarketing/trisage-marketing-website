const https = require('https');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

async function test() {
  console.log('--- TESTING LIVE DOMAIN ASSETS ---');
  try {
    const r1 = await fetchBuffer('https://trisagemarketing.com/icon.png');
    console.log('https://trisagemarketing.com/icon.png -> Status:', r1.status, '| Size:', r1.body.length, 'bytes');

    const r2 = await fetchBuffer('https://trisagemarketing.com/favicon.ico');
    console.log('https://trisagemarketing.com/favicon.ico -> Status:', r2.status, '| Size:', r2.body.length, 'bytes');

    const r3 = await fetchBuffer('https://trisagemarketing.com/');
    const html = r3.body.toString('utf8');
    const relIconMatches = html.match(/<link[^>]*rel=["'](shortcut )?icon["'][^>]*>/gi);
    console.log('Found <link rel="icon"> tags in live HTML:');
    console.log(relIconMatches || 'NONE FOUND!');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
