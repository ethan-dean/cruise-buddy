const express = require("express");
const httpRedirectApp = express();
const app = express();

const morgan = require("morgan"); // Morgan provides easy logging for express on docker.
app.use(morgan("common"));        // By default it logs to stdout.

const path = require('path');

const database = require("./database");


///////////////////////////////////////////////////////////////////////////////////////////
// TODO: Setup database responses

///////////////////////////////////////////////////////////////////////////////////////////
// Make sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map|.svg)$/i.test(req.path)) {
    next();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.resolve('./dist/index.html'));
  }
});

app.use(express.static(path.resolve('./dist')));

app.use((req, res) => {
    res.status(200).send('React broken :(');
});

///////////////////////////////////////////////////////////////////////////////////////////
// Health check for app.
app.get("/healthz", function(req, res) {
  // TODO: Do app logic here to determine if app is truly healthy
  // should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

///////////////////////////////////////////////////////////////////////////////////////////
// Http Redirect to Https
httpRedirectApp.get("*", function(req, res) {
  res.redirect("https://" + req.headers.host + req.path);
});

module.exports = {
  app,
  httpRedirectApp,
};