const env = require("dotenv/config");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const express = require("express");
const httpRedirectApp = express();
const httpsServerApp = express();

const morgan = require("morgan"); // Morgan provides easy logging for express on docker.
httpsServerApp.use(morgan("common"));        // By default it logs to stdout.

const path = require('path');

const { addNewUser, getUsersForCruise } = require("./database");

///////////////////////////////////////////////////////////////////////////////////////////
// TODO: Fill in all database API routes here.

// // Middleware to parse JSON bodies, applied only to the /api routes.
// app.use('/api', express.json());
// app.use('/api', cors());

// // Use the lax middleware that returns an empty auth object when unauthenticated
// app.get('/api/get-users', ClerkExpressWithAuth(), (req, res) => {
//   res.json(req.auth)
// });

// Endpoint test
httpsServerApp.get('/api/get-users/:cruiseid', express.json(), async (req, res) => {
   const cruiseID = req.params.cruiseid;
   [err, results] = await getUsersForCruise(cruiseID);
    if (err) {
        console.error('Error retrieving users:', err.stack);
        res.status(500).send('Error retrieving users');
        return;
    }
    console.log(results);
    res.status(200).send(results);
});

// Endpoint to add a user, under the /api route
httpsServerApp.post('/api/add-user', express.json(), async (req, res) => {
    const { firstName, lastName } = req.body;

    [err, results] = await addNewUser(firstName, lastName);
    if (err) {
        console.error('Error adding user:', err.stack);
        res.status(500).send('Error adding user');
        return;
    }
    console.log(results);
    res.status(200).send('User added successfully');
});

///////////////////////////////////////////////////////////////////////////////////////////
// Make sure that any request that does not matches a static file
// in the build folder, will just serve index.html. Client side routing is
// going to make sure that the correct content will be loaded.
httpsServerApp.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map|.svg)$/i.test(req.path)) {
    next();
  } else {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.resolve('./dist/index.html'));
  }
});

httpsServerApp.use(express.static(path.resolve('./dist')));

httpsServerApp.use((req, res) => {
    res.status(200).send('We are under construction... check back soon!');
});

///////////////////////////////////////////////////////////////////////////////////////////
// Http Redirect to Https
httpRedirectApp.get("*", function(req, res) {
  res.redirect("https://" + req.headers.host + req.path);
});

module.exports = {
  httpsServerApp,
  httpRedirectApp,
};