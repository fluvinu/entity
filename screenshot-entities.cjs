const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/entities');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-entities.png' });
  await browser.close();
})();
