var mysql = require("mysql");
var pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123",
  database: "truesales_local",
  connectionLimit: 1000,
  multipleStatements: true,
});
module.exports = pool;

// New AWS Connection

// var mysql = require("mysql2");
// var pool = mysql.createPool({
//   host: "13.235.89.36",
//   port: 3306,
//   user: "sammyremote",
//   password: "Reset@123",
//   database: "truesalesdb",
//   connectionLimit: 1000,
//   multipleStatements: true,
// });
// module.exports = pool;


// var mysql = require("mysql");
// var pool = mysql.createPool({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "Reset@123",
//   database: "truesalesdbdev",
//   connectionLimit: 1000,
//   multipleStatements: true,
// });
// module.exports = pool;

// var mysql = require("mysql2")
// var pool = mysql.createPool({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "1234",
//     database: "truesalesdb",
//     connectionLimit: 1000,
//     multipleStatements: true,
//   });
//   module.exports = pool;

// var mysql = require("mysql2")
// var pool = mysql.createPool({
//     host: "13.234.12.95",
//     port: 3306,
//     user: "root",
//     password: "Reset@123",
//     database: "truesalesdb",
//     connectionLimit: 1000,
//     multipleStatements: true,
//   });
//   module.exports = pool;