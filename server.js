const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const sourceDir = path.join(__dirname, "src");

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
  const staticRoot = requestedPath.startsWith("/src/") ? sourceDir : publicDir;
  const staticPath = requestedPath.startsWith("/src/")
    ? requestedPath.replace("/src/", "/")
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

server.listen(port, () => {
  console.log(`Todo Project is running at http://localhost:${port}`);
});
