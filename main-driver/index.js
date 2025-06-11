// main-driver/index.js
import dotenv from 'dotenv';
dotenv.config();

const runLocal = process.env.LOCAL === 'true';

const SCRAPER_ONE_URL = process.env.SCRAPER_ONE_URL || 'https://scraper-one.example.workers.dev';

async function run() {
  if (runLocal) {
    console.log('Running scraper-one locally...');
    const { scrapeNvidia } = await import('../scraper-one/index.js');
    const data = await scrapeNvidia();
    console.log('Scraped data:', data);
    // Save to file or log
  } else {
    console.log('Triggering scraper-one worker...');
    const res = await fetch(SCRAPER_ONE_URL);
    const data = await res.json();
    console.log('Remote scraped data:', data);
  }
}

run().catch(console.error);