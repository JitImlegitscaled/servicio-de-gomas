import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/alexa/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

await page.evaluate(() => {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('visible'));
});
await new Promise(r => setTimeout(r, 600));

const sections = ['hero','services','how','about','why','coverage','contact','booking','footer'];

for (const name of sections) {
  const sel = name === 'footer' ? 'footer' : `#${name}`;
  const info = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    // Get absolute top relative to document
    let top = 0, node = el;
    while (node) { top += node.offsetTop || 0; node = node.offsetParent; }
    return { top, height: el.offsetHeight };
  }, sel);
  if (!info) { console.log(`skip ${sel}`); continue; }

  const clipH = Math.min(info.height, 1800);
  await page.screenshot({
    path: path.join(screenshotDir, `sec-${name}.png`),
    clip: { x: 0, y: info.top, width: 390, height: clipH },
    fullPage: false
  });
  console.log(`sec-${name}.png  top=${info.top} h=${info.height}`);
}

await browser.close();
