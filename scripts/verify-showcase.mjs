import puppeteer from 'puppeteer';

const URL = 'http://localhost:3000';

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1280, height: 900 },
});
try {
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle0' });
  const info = await page.evaluate(() => ({
    title: document.title,
    hasShowcase: !!document.querySelector('.showcase-grid'),
    imgCount: document.querySelectorAll('.showcase-card img').length,
    imgsLoaded: [...document.querySelectorAll('.showcase-card img')].every(i => i.complete && i.naturalWidth > 0),
  }));
  console.log('page:', info);
  // Disable smooth scroll, force all fade-in visible, swap lazy loading to eager
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
  });
  // Wait for all images to finish loading
  await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('.showcase-card img')];
    await Promise.all(imgs.map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
  });
  await page.evaluate(() => {
    const el = document.querySelector('.showcase-header');
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
    window.scrollBy(0, -40);
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: 'G:/My Drive/@secondbrain/AEC Logix/images/_verify-showcase.png', type: 'png', fullPage: false });
  console.log('saved verify screenshot');
} finally {
  await browser.close();
}
