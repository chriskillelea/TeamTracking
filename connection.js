const mysql = require('mysql');

const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: '',
  password: '',
  database: 'employeedatabase',
});

module.exports = db;
