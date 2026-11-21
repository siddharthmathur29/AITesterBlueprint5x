import { createApp } from "./app.mjs";

const app = createApp({ serveStatic: false });

export function makeHandler(routePath) {
  return function handler(request, response) {
    request.url = routePath;
    return app(request, response);
  };
}
