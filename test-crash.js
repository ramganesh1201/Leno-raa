import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
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
    console.log('Page loaded successfully without uncaught errors.');
  } catch (err) {
    console.log('GOTO ERROR:', err.message);
  }

  await browser.close();
})();
