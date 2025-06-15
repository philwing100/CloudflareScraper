export async function run(env) {
  const browser = await env.BROWSER.newContext();
  const page = await browser.newPage();

  await page.goto("https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?workerSubType=0c40f6bd1d8f10adf6dae42e46d44a17&workerSubType=ab40a98049581037a3ada55b087049b7&locationHierarchy1=2fcb99c455831013ea52fb338f2932d8&locations=91336993fab910af6d702b631b94c2de", {
    waitUntil: "domcontentloaded",
  });

  const hrefs = await page.$$eval('a', links => links.map(link => link.href));
  await browser.close();

  return {
    body: JSON.stringify(hrefs, null, 2),
    headers: { "Content-Type": "application/json" },
  };
}
