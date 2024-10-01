const fs = require("fs");

const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

// Constants set in "compose.yaml".
module.exports = {
  connectionConfig: {
    host: 'db_service', // or the host of your MariaDB server
    user: 'root', // your MariaDB username
    password: 'temp', // your MariaDB password
    database: 'example', // your target database
    port: 3306

    // database: process.env.DATABASE_DB || 'example',
    // host: process.env.DATABASE_HOST || "localhost",
    // port: process.env.DATABASE_PORT || 3306,
    // user: process.env.DATABASE_USER || "root",
    // password: "temp"
    // process.env.DATABASE_PASSWORD
    //   ? readFileSync(process.env.DATABASE_PASSWORD)
    //   : null
  },
  httpsServerPort: 443,
  httpRedirectPort: 80,
};