import * as nvidiaScraper from './tests/nvidia-scraper.js';

import { launch } from '@cloudflare/playwright';

const routes = {
    "/nvidia-scraper": nvidiaScraper.run,
};

export default {
    async fetch(request, env, ctx) {
        const { pathname } = new URL(request.url);
        const handler = routes[pathname];
        console.log(pathname, handler);

        if (!handler) {
            return new Response("Test not found ", { status: 404 });
        }


        try {
            const browser = await launch(env.browser);
            const page = await browser.newPage();
           // await page.context().tracing.start({ screenshots: true, snapshots: true });
            const result = await handler(env, page);
           //  await page.context().tracing.stop({ path: "trace.zip" });

            await browser.close();
            return new Response(result.body, {
                status: 200,
                headers: result.headers || { "Content-Type": "text/plain" },
            });
        } catch (err) {
            return new Response(`Error: ${err.message}`, { status: 500 });
        }
    },
};
