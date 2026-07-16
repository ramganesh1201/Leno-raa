const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
  });
  const page = await browser.newPage();

  page.on("pageerror", (err) => {
    console.log("PAGE ERROR:", err.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.log("CONSOLE ERROR:", msg.text());
    }
  });

  try {
    // Navigate to home to set localStorage
    await page.goto("http://localhost:8081/", { waitUntil: "domcontentloaded" });

    // We can't easily mock supabase auth without credentials.
    // Let's just navigate to customize and see.
    await page.goto("http://localhost:8081/customize", { waitUntil: "domcontentloaded" });

    // Wait a bit
    await new Promise((r) => setTimeout(r, 2000));
    console.log("No crash detected for guest.");
  } catch (err) {
    console.log("GOTO ERROR:", err.message);
  }

  await browser.close();
})();
