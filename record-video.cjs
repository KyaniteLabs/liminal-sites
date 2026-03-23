const puppeteer = require('puppeteer');
const { exec } = require('child_process');

async function recordCanvas(htmlPath, outputPath, duration = 5) {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 800, height: 600 }
  });
  const page = await browser.newPage();

  await page.goto('file://' + htmlPath);
  await page.waitForSelector('canvas', { timeout: 10000 });

  // Wait for animation to start
  await page.waitForTimeout(2000);

  // Use ffmpeg to record the canvas
  const ffmpegCmd = `ffmpeg -f x11grab -r 30 -s 800x600 -i :0.0+0,0 -t ${duration} -y -pix_fmt rgb24 ${outputPath}`;

  // For now, let's take multiple screenshots and create a simple approach
  // We'll create a GIF using screenshots
  console.log(`Recording ${htmlPath}...`);

  const frames = [];
  const frameCount = 30;
  const frameDelay = 150; // 150ms between frames = ~6.7fps

  for (let i = 0; i < frameCount; i++) {
    const canvas = await page.$('canvas');
    if (canvas) {
      const screenshot = await canvas.screenshot();
      fs.writeFileSync(
        outputPath.replace('.gif', `-${String(i).padStart(2, '0')}.png`),
        screenshot
      );
      frames.push(screenshot);
    }
    await page.waitForTimeout(frameDelay);
  }

  await browser.close();

  // Create GIF using ffmpeg (if available) or just note the frames
  console.log(`Captured ${frames.length} frames`);

  // Try to create GIF with ffmpeg
  const gifCmd = `ffmpeg -framerate 6.7 -i ${outputPath.replace('.gif', '-%02d.png')} ${outputPath} 2>&1`;
  exec(gifCmd, (error) => {
    if (error) {
      console.log('Note: ffmpeg not available for GIF creation. Frames saved as individual PNGs.');
    } else {
      console.log(`GIF created: ${outputPath}`);
    }
  });
}

const htmlPath = process.argv[2];
const outputPath = process.argv[3];

if (!htmlPath || !outputPath) {
  console.error('Usage: node record-video.cjs <htmlPath> <outputPath>');
  process.exit(1);
}

recordCanvas(htmlPath, outputPath).catch(console.error);
