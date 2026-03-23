const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('file:///Users/simongonzalezdecruz/workspaces/liminal/landing-assets/cli-project-final.html');

  await page.waitForSelector('canvas', { timeout: 5000 });
  await page.waitForTimeout(2000);

  const canvas = await page.$('canvas');

  if (canvas) {
    await canvas.screenshot({
      path: '/Users/simongonzalezdecruz/workspaces/liminal/landing-assets/p5-particles.png'
    });
    console.log('Screenshot saved');
  }

  await browser.close();
})();
