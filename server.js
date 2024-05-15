const http = require("http");
const https = require("https");
const fs = require("fs");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const PORT = 80, HTTPS_PORT = 443;
const app = next({ dev, hostname: "localhost", port: PORT });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    })
    .listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });

  if (fs.existsSync("privkey.pem") && fs.existsSync("fullchain.pem")) {
    const options = {
      key: fs.readFileSync("privkey.pem"),
      cert: fs.readFileSync("fullchain.pem"),
    };

    https
      .createServer(options, function (req, res) {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      })
      .listen(HTTPS_PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${HTTPS_PORT}`);
      });
  }
});