//nvidia-scraper.js

import { launch } from '@cloudflare/playwright';


export async function run(env) {
  //const browser = await env.BROWSER.newContext();
  const browser = await launch(env.browser);
  const page = await browser.newPage();


  await page.goto("https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?workerSubType=0c40f6bd1d8f10adf6dae42e46d44a17&workerSubType=ab40a98049581037a3ada55b087049b7&locationHierarchy1=2fcb99c455831013ea52fb338f2932d8&locations=91336993fab910af6d702b631b94c2de", {
    waitUntil: "domcontentloaded",
  });

  const elements = await page.locator("a.job-title");
  //Ideally there is one away that grabs all of the elements because it seems like 
  const count = elements.count();
  let objs = [];


  //This needs to become a promise.all
  for (let i = 0; i < count; i++) {
    const temp = elements.nth(i);
    const text = temp.textContent();
    const href = temp.getAttribute('href');

    objs.push({ href, text});
  }

  await browser.close();

  return {
    body: JSON.stringify(objs, null, 2),
    headers: { "Content-Type": "application/json" },
  };
}
