const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Install puppeteer-screen-recorder if needed, but we'll use built-in screenshot + setTimeout

async function recordAnimation(htmlPath, outputPath, duration = 5000) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file://' + htmlPath);
  await page.waitForSelector('canvas', { timeout: 10000 });

  // Wait for animation to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Capture multiple frames for GIF
  const frames = [];
  const frameCount = 30; // 30 frames for ~3 seconds at 10fps
  const frameDelay = 100; // 100ms between frames

  for (let i = 0; i < frameCount; i++) {
    const canvas = await page.$('canvas');
    if (canvas) {
      // Capture screenshot
      const buffer = await canvas.screenshot({
        encoding: 'base64'
      });
      frames.push(buffer);
    }
    await new Promise(resolve => setTimeout(resolve, frameDelay));
  }

  await browser.close();

  // Save frames info
  fs.writeFileSync(
    outputPath.replace('.png', '-frames.json'),
    JSON.stringify({ frames, frameCount, frameDelay })
  );

  console.log(`Captured ${frames.length} frames for ${outputPath}`);
  return frames;
}

// Get HTML path and output name from command line
const htmlPath = process.argv[2];
const outputName = process.argv[3];

if (!htmlPath || !outputName) {
  console.error('Usage: node record-animation.cjs <htmlPath> <outputName>');
  process.exit(1);
}

recordAnimation(htmlPath, path.join('/Users/simongonzalezdecruz/workspaces/liminal/landing-assets', outputName))
  .catch(console.error);
