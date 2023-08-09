import { chromium } from 'k6/experimental/browser';

export default async function () {
  const browser = chromium.launch({
    headless: false,
    timeout: '60s', // Or whatever time you want to define
  });
  const page = browser.newPage();

  try {
    await page.goto('https://test.k6.io/');
    page.screenshot({ path: 'screenshot.png' });
  } finally {
    page.close();
    browser.close();
  }
}
