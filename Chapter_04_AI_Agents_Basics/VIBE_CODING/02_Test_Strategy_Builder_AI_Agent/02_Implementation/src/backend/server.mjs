import { createApp } from "./app.mjs";
import { implementationRoot, serverConfig } from "./config.mjs";
import { resolve } from "node:path";

const app = createApp({ serveStatic: process.env.NODE_ENV === "production" });

if (process.env.NODE_ENV !== "production") {
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: resolve(implementationRoot, "vite.config.mjs"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(serverConfig.port, "127.0.0.1", () => {
  console.log(`Test Strategy Builder running at http://localhost:${serverConfig.port}`);
});
