#!/usr/bin/env node

import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/');

  // DOM logic
  const title = await page.title();
  const data = {
    id: `nvidia-${Date.now()}`,
    title,
    company: 'NVIDIA',
    link: page.url(),
    origin: 'nvidia-university',
    access_time: new Date().toISOString(),
  };

  console.log('✅ Scraped data:\n', data);
  await browser.close();
})();
