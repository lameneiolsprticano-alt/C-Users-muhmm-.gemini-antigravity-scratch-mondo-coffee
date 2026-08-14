import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));

await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const before = await page.evaluate(() => ({
  scrollY: window.scrollY,
  documentHeight: document.documentElement.scrollHeight,
  viewportHeight: window.innerHeight,
  heroTouchAction: getComputedStyle(document.querySelector('[aria-label="Mondo Coffee hero"]')).touchAction,
  canvasPointerEvents: getComputedStyle(document.querySelector('canvas')).pointerEvents,
  heroPosition: getComputedStyle(document.querySelector('[aria-label="Mondo Coffee hero"]')).position,
}));

await page.mouse.wheel(0, 900);
await page.waitForTimeout(300);
const after = await page.evaluate(() => ({ scrollY: window.scrollY }));

const result = { before, after, errors };
console.log(JSON.stringify(result, null, 2));

if (before.documentHeight <= before.viewportHeight || after.scrollY <= before.scrollY || before.canvasPointerEvents !== 'none') {
  await browser.close();
  process.exit(1);
}

await browser.close();
