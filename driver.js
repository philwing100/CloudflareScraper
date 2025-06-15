import * as nvidiaScraper from './tests/nvidia-scraper.js';

const routes = {
  "/nvidia-scraper": nvidiaScraper.run,
};

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const handler = routes[pathname];

    if (!handler) {
      return new Response("Test not found", { status: 404 });
    }

    try {
      const result = await handler(env);
      return new Response(result.body, {
        status: 200,
        headers: result.headers || { "Content-Type": "text/plain" },
      });
    } catch (err) {
      return new Response(`Error: ${err.message}`, { status: 500 });
    }
  },
};
