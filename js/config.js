// Required modules
var mysql = require('mysql');

// Database login info
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'bamazon'
});

module.exports = connection;