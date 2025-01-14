import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initWebSockets } from "@/server/ws/ws-server";

const port = parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url!, true);
  void handle(req, res, parsedUrl);
});

initWebSockets(server);

server.listen(port);

console.log(
  `> Server listening at http://localhost:${port} as ${
    dev ? "development" : process.env.NODE_ENV
  }`,
);
