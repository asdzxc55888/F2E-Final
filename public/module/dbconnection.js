//資料庫初始化
var mysql = require("mysql");

const connectionInformation = {
    host: "localhost",
      user: "root",
      password: "root",
      database : 'project',
      multipleStatements: true
}

var connection = mysql.createConnection(connectionInformation);

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected datebase!");
});

module.exports = connection;