import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "/private/tmp/claude-501/-Users-apple-Desktop-bugsy-bugsy-app/88649740-cc8a-4291-a0d8-b48e948bd105/scratchpad/pd-4a.png" });
await page.waitForTimeout(700);
await page.screenshot({ path: "/private/tmp/claude-501/-Users-apple-Desktop-bugsy-bugsy-app/88649740-cc8a-4291-a0d8-b48e948bd105/scratchpad/pd-4b.png" });
await browser.close();
