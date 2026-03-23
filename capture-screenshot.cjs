const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file:///Users/simongonzalezdecruz/workspaces/liminal/landing-assets/cli-project-final.html');

  await page.waitForSelector('canvas', { timeout: 10000 });

  // Wait a bit for animation to render
  await new Promise(resolve => setTimeout(resolve, 3000));

  const canvas = await page.$('canvas');

  if (canvas) {
    await canvas.screenshot({
      path: '/Users/simongonzalezdecruz/workspaces/liminal/landing-assets/p5-particles.png'
    });
    console.log('Screenshot saved');
  } else {
    // Fallback to full page
    await page.screenshot({
      path: '/Users/simongonzalezdecruz/workspaces/liminal/landing-assets/p5-particles.png'
    });
    console.log('Full page screenshot saved');
  }

  await browser.close();
})();
