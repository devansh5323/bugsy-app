const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 20000 });
  await page.evaluate(() => {
    localStorage.setItem("bugsy-state-v1", JSON.stringify({ kind: "who" }));
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: "C:/Users/devan/Downloads/bugsy-who.png" });
  console.log("who screen ok");
  await browser.close();
})();
