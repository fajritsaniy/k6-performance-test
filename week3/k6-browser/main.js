// main.js
import { chromium } from 'k6/experimental/browser';
import { check } from 'k6';
import { performTextBox } from './Resource/resource.js';
import { checkOutput } from './Assertion/assertion.js';
import { demoQAUrl, textBoxEndPoint } from './PageLocator/locator.js'

export default async function () {
  const browser = chromium.launch({ headless: false });
  const page = browser.newPage();

  try {
    await page.goto(`${demoQAUrl}${textBoxEndPoint}`, { waitUntil: 'networkidle' });
    await performTextBox(page);

    check(page, {
      'Message Registration Assertion': checkOutput(page),
    });

  } finally {
    page.close();
    browser.close();
  }
}
