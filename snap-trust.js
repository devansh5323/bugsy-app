const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 20000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  // Click "Say Hi 👋" to advance to trust screen
  await page.click("button");
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "C:/Users/devan/Downloads/bugsy-trust.png" });
  console.log("trust screen ok");
  await browser.close();
})();
