import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));
app.get("/*", serveStatic({ root: "./src/" }));

Deno.serve({ port: 3000 }, app.fetch);
