var mySQL = require('mysql');

var connection = mySQL.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'csarmiento',
  database : 'api_works'
});

module.exports = connection;
