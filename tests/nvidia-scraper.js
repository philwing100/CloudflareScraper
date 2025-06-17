//nvidia-scraper.js

export async function run(env, page) {
  try {
    // Increase timeout and add logging
    await page.goto("https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?workerSubType=0c40f6bd1d8f10adf6dae42e46d44a17&workerSubType=ab40a98049581037a3ada55b087049b7&locationHierarchy1=2fcb99c455831013ea52fb338f2932d8&locations=91336993fab910af6d702b631b94c2de", {
      waitUntil: "networkidle",
      timeout: 5000
    });

    // Wait for the job listings container
    await page.waitForSelector('a[data-uxi-element-id="jobItem"]', {
      timeout: 5000,
      state: 'attached'
    });

    const elements = await page.locator('a[data-uxi-element-id="jobItem"]');
    const count = await elements.count();
    console.log("Initial count of elements:", count);

    if (count === 0) {
      console.log("No elements found - checking page content");
      const pageContent = await page.content();
      console.log("Page HTML length:", pageContent.length);
      return {
        body: JSON.stringify({
          error: "No jobs found",
          count: 0,
          timestamp: new Date().toISOString()
        }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Rest of your existing code
    const objs = await Promise.all(
      Array.from({ length: count }, async (_, i) => {
        const el = elements.nth(i);
        const href = await el.getAttribute('href');
        const text = await el.textContent();

        let postedDate = '';
        try {
          const postedDateElement = page.locator('div[data-automation-id="postedOn"]').nth(i);
          await postedDateElement.waitFor({ state: 'visible', timeout: 5000 });
          postedDate = await postedDateElement.locator('dd').textContent();
        } catch (error) {
          console.log(`Failed to get posted date for job ${i}: ${error.message}`);
        }

        return {
          href,
          title: text?.trim() || '',
          postedDate: postedDate?.trim().replace("postedDate", "") || 'Not available',
        };
      })
    );

    return {
      body: JSON.stringify(objs, null, 2),
      headers: { "Content-Type": "application/json" },
    };

  } catch (error) {
    console.error("Scraping error:", error);
    return {
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      headers: { "Content-Type": "application/json" },
    };
  }
}
