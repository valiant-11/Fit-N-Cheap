const fs = require('fs');
const https = require('https');
const path = require('path');

const destDir = path.resolve(__dirname, '../public/models');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const destFile = path.join(destDir, 'pose_landmarker.task');
const targetUrl = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';

console.log('Downloading model from:', targetUrl);
console.log('Saving to:', destFile);

function download(url, redirectCount = 0) {
  if (redirectCount > 5) {
    console.error('Too many redirects');
    process.exit(1);
  }

  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      download(res.headers.location, redirectCount + 1);
      return;
    }

    if (res.statusCode !== 200) {
      console.error('Non-200 status code:', res.statusCode);
      process.exit(1);
    }

    const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
    let downloadedBytes = 0;
    const fileStream = fs.createWriteStream(destFile);

    res.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes > 0) {
        const pct = ((downloadedBytes / totalBytes) * 100).toFixed(1);
        process.stdout.write(`\rProgress: ${pct}% (${downloadedBytes}/${totalBytes} bytes)`);
      }
    });

    res.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log('\nModel download successfully completed!');
      console.log('File size:', fs.statSync(destFile).size, 'bytes');
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error('\nNetwork error:', err.message);
    process.exit(1);
  });
}

download(targetUrl);
