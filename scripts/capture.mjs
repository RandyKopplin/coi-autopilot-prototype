import puppeteer from 'puppeteer';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const OUT_DIR = 'G:/My Drive/@secondbrain/AEC Logix/images';
const URL = 'http://localhost:5173';
const WIDTH = 1400;
const HEIGHT = 900;

const shots = [
  {
    name: 'coi-autopilot-dashboard.png',
    label: 'GC dashboard',
    setup: async (page) => {
      await page.evaluate(() => localStorage.removeItem('coi-autopilot-brand-v1'));
      await page.goto(URL, { waitUntil: 'networkidle0' });
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('.persona-btn')];
        const gc = btns.find(b => b.textContent.includes('(GC)'));
        gc?.click();
      });
    },
  },
  {
    name: 'coi-autopilot-vendors.png',
    label: 'Vendors table',
    setup: async (page) => {
      await page.evaluate(() => {
        const items = [...document.querySelectorAll('.nav-item')];
        const vendors = items.find(n => n.textContent.trim().startsWith('Vendors'));
        vendors?.click();
      });
    },
  },
  {
    name: 'coi-autopilot-intake.png',
    label: 'Vendor intake',
    setup: async (page) => {
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('.persona-btn')];
        const vendor = btns.find(b => b.textContent.includes('Vendor'));
        vendor?.click();
      });
    },
  },
  {
    name: 'coi-autopilot-report.png',
    label: 'Executive report',
    setup: async (page) => {
      // back to GC, open report
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('.persona-btn')];
        const gc = btns.find(b => b.textContent.includes('(GC)'));
        gc?.click();
      });
      await new Promise(r => setTimeout(r, 200));
      await page.evaluate(() => {
        const items = [...document.querySelectorAll('.nav-item')];
        const report = items.find(n => n.textContent.includes('Executive Report'));
        report?.click();
      });
    },
  },
];

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: WIDTH, height: HEIGHT },
  });
  try {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle0' });
    for (const shot of shots) {
      await shot.setup(page);
      await new Promise(r => setTimeout(r, 500));
      const outPath = path.join(OUT_DIR, shot.name);
      await page.screenshot({ path: outPath, type: 'png', fullPage: false });
      console.log(`saved ${shot.label} → ${outPath}`);
    }
  } finally {
    await browser.close();
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
