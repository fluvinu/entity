const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text(), msg.args()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message, error.stack));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  await browser.close();
})();
