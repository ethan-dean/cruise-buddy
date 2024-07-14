const { readFileSync } = require("fs");
const http = require("http");
const https = require("https");

const app = require("./server");
const { port } = require("./config");

///////////////////////////////////////////////////////////////////////////////////////////
// Start the server.
const cts = {
  cert: readFileSync("/etc/letsencrypt/live/thecruiseconnect.com/fullchain.pem"),
  key: readFileSync("/etc/letsencrypt/live/thecruiseconnect.com/privkey.pem")
}

const http_server = http.createServer(app).listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log('Press Ctrl+C to quit.');
});
const https_server = https.createServer(cts, app).listen(443, () => {
  console.log(`App listening on port ${443}`);
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