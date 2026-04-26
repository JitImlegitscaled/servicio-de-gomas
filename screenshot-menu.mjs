import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/alexa/.cache/puppeteer/chrome/win64-147.0.7727.57/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 500));

// Open mobile menu via JS
await page.evaluate(() => document.getElementById('hamburger').click());
await new Promise(r => setTimeout(r, 600));

await page.screenshot({ path: path.join(screenshotDir, 'menu-open.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
console.log('menu-open.png saved');
await browser.close();
