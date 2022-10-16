const mysql = require("mysql");

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "databases"
  });
    
  // Connect to MySQL server
  con.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
  });
    
  module.exports = con;
  