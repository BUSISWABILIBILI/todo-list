import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const serverConfig = require("./server.config.json");
const directoryName = path.dirname(fileURLToPath(import.meta.url));

let port = Number(process.env.PORT || serverConfig.port);
const publicDir = path.join(directoryName, "public");
const buildDir = path.join(directoryName, "docs");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  const requestedUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = requestedUrl.pathname === "/" ? "/index.html" : requestedUrl.pathname;
  const staticRoot = requestedPath.startsWith("/docs/") ? buildDir : publicDir;
  const staticPath = requestedPath.startsWith("/docs/")
    ? requestedPath.replace("/docs/", "/")
    : requestedPath;
  const filePath = path.join(staticRoot, staticPath);
  const relativePath = path.relative(staticRoot, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";

    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
});

server.on("error", (error) => {
  if (error.code !== "EADDRINUSE") {
    throw error;
  }

  if (process.env.PORT) {
    console.error(`Port ${port} is already in use. Choose another port and try again.`);
    process.exit(1);
  }

  const busyPort = port;
  port += 1;
  console.log(`Port ${busyPort} is already in use. Trying http://localhost:${port} instead.`);
  server.listen(port);
});

server.listen(port, () => {
  console.log(`Todo Project is running at http://localhost:${port}`);
});
