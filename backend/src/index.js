const { readFileSync } = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const { app, httpRedirectApp } = require("./server");
const { port } = require("./config");

///////////////////////////////////////////////////////////////////////////////////////////
// Start the server.
const cts = {
  cert: readFileSync(path.resolve("./certs/fullchain.pem")),
  key: readFileSync(path.resolve("./certs/privkey.pem"))
}

const https_server = https.createServer(cts, app).listen(port, () => {
  console.log(`App listening on port ${port}`);
});
const http_server = http.createServer(httpRedirectApp).listen(80, () => {
  console.log(`Http redirect app listening on port ${80}`);
  console.log('Press Ctrl+C to quit.');
});

///////////////////////////////////////////////////////////////////////////////////////////
// Need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM.
// Which also won't work on using npm start.

// Quit on ctrl-c when running docker in terminal.
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// Quit properly on docker stop.
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// Shut down server.
function shutdown() {
  http_server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
  https_server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}
