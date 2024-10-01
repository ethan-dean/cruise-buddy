const mysql = require('mysql2');

const { connectionConfig } = require('./config');

///////////////////////////////////////////////////////////////////////////////////////////
// Create a connection to the MariaDB database
const connection = mysql.createConnection(connectionConfig);

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.stack);
        return;
    }
    console.error('Connected to MariaDB as id ' + connection.threadId);
});
connection.query('SHOW DATABASES',(err, results) => {
  if (err) {
    console.error('Error showing databases');
    return;
  }
  console.error(results);
});

///////////////////////////////////////////////////////////////////////////////////////////
// Create user_data table if it does not exist already.
const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS user_data (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL
  )`;
connection.query(createUserTableQuery, (err, results, fields) => {
  if (err) {
    console.error('Error creating table:', err.stack);
    return;
  }
  console.log(results);
});

// Create cruise_data table if it does not exist already.
const createCruiseTableQuery = `
  CREATE TABLE IF NOT EXISTS cruise_data (
      cruise_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(30),
      ship_name VARCHAR(30),
      departure_date DATE
  )`;
connection.query(createCruiseTableQuery, (err, results, fields) => {
  if (err) {
    console.error('Error creating table:', err.stack);
    return;
  }
  console.log(results);
});

//  Create joined_cruises table if it does not exist already.
const createJoinedCruiseTableQuery = `
  CREATE TABLE IF NOT EXISTS joined_cruises (
      user_id INT UNSIGNED,
      cruise_id INT UNSIGNED,
      FOREIGN KEY (user_id) REFERENCES user_data(user_id),
      FOREIGN KEY (cruise_id) REFERENCES cruise_data(cruise_id)
  )`;
connection.query(createJoinedCruiseTableQuery, (err, results, fields) => {
  if (err) {
    console.error('Error creating table:', err.stack);
    return;
  }
  console.log(results);
});

// Check data on startup.
connection.query('SELECT * FROM user_data',(err, results) => {
  if (err) {
    console.error('Error secting table user_data');
    return;
  }
  console.log(results);
});
connection.query('SELECT * FROM cruise_data',(err, results) => {
  if (err) {
    console.error('Error secting table cruise_data');
    return;
  }
  console.log(results);
});
connection.query('SELECT * FROM joined_cruises',(err, results) => {
  if (err) {
    console.error('Error secting table joined_cruises');
    return;
  }
  console.log(results);
});

///////////////////////////////////////////////////////////////////////////////////////////
// Functions for https server to use to query database.

function handleError(err, results) {
  if (err) {
    return [err, null];
  }
  return [null, results];
}

// Add user to user_data when they create their profile.
async function addUser(firstName, lastName) {
  const insertUserQuery = `INSERT INTO user_data (first_name, last_name) 
                             VALUES (?, ?)`;
  connection.query(insertUserQuery, [firstName, lastName], handleError);
}

// Edit user data in user_data when they edit profile.
async function editUser(firstName, lastName, userID) {
  const updateUserQuery = `UPDATE user_data 
                             SET first_name = ?, last_name = ? 
                             WHERE user_id = ?`;
  connection.query(insertUserQuery, [firstName, lastName, userID], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

// Add cruise to cruise_data if it does not exist, when someone joins a cruise.
async function addCruise(companyName, shipName, departureDate) {
  const addCruiseQuery = ` INSERT INTO cruise_data (company_name, ship_name, departure_date)
                                   VALUES (?, ?, ?)`;
  connection.query(addCruiseQuery, [companyName, shipName, departureDate], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

// Add user_id, cruise_id pair to joined_cruises to track 
async function addUserToCruise(userID, cruiseID) {
  const addCruiseToUserQuery = ` INSERT INTO joined_cruises VALUES (?, ?)`
  connection.query(addCruiseToUserQuery, [userID, cruiseID], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

// Return the user_data of users on cruise, cruiseID.
async function getUsersForCruise (cruiseID) {
  const selectUsersQuery = `SELECT u.first_name, u.last_name
                             FROM joined_cruises jc
                             JOIN user_data u ON jc.user_id = u.user_id
                             WHERE jc.cruise_id = ?`;
  connection.query(selectUsersQuery, [cruiseID], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

// Return the cruise_data of cruises for user, userID.
async function getCruisesForUser (userID) {
  const selectUserQuery = `SELECT c.company_name, c.ship_name, c.departure_date
                             FROM joined_cruises jc
                             JOIN cruise_data c ON jc.cruise_id = c.cruise_id
                             WHERE jc.user_id = ?`;
  connection.query(selectUserQuery, [userID], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

async function getCruiseID(companyName, shipName, departureDate) {
  const selectCruiseIDQuery = `SELECT cruise_id
                                 FROM cruise_data
                                 WHERE company_name = ? AND ship_name = ? AND departure_date = ?`;
  connection.query(selectCruiseIDQuery, [userID], (err, results) => {
    if (err) {
      return [err, null];
    }
    return [null, results];
  });
}

///////////////////////////////////////////////////////////////////////////////////////////
// Function exports for 'server.js'.
module.exports = {
  addNewUser,
  getUsersForCruise,
};
