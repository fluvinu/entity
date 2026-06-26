import type { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

export function serveStaticFiles(app: Hono) {
  app.use("*", serveStatic({ root: "./dist/public" }));
}
