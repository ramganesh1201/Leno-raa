const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  try {
    await page.goto('http://localhost:8081/customize', { waitUntil: 'networkidle0' });
    const body = await page.evaluate(() => document.body.innerText);
    console.log('PAGE TEXT:\n', body);
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }

  await browser.close();
})();
