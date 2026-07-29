const https = require('https');
const http = require('http');

function checkUrl(urlStr) {
  return new Promise((resolve) => {
    const client = urlStr.startsWith('https') ? https : http;
    client.get(urlStr, (res) => {
      console.log(`[${urlStr}] Status: ${res.statusCode} | Headers:`, {
        'content-type': res.headers['content-type'],
        'location': res.headers['location']
      });
      resolve(res.statusCode);
    }).on('error', (e) => {
      console.log(`[${urlStr}] Error:`, e.message);
      resolve(null);
    });
  });
}

async function run() {
  console.log('--- LIVE SITE FAVICON HTTP DIAGNOSTICS ---');
  await checkUrl('http://trisagemarketing.com');
  await checkUrl('https://trisagemarketing.com');
  await checkUrl('https://trisagemarketing.com/favicon.ico');
  await checkUrl('https://trisagemarketing.com/icon.png');
  await checkUrl('https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://trisagemarketing.com&size=128');
}

run();
