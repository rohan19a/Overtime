// Import the library

const server = require('server');
const express = require("express");
const database = require('./sqlConnection');
  
const app = express();
  
app.listen(5000, () => {
  console.log(`Server is up and running on 5000 ...`);
});
  
// Use Route Function from below Examples Here...
  
app.get("/", (req, res) => {
  
    // Call Route Function Here...
});

// Launch the server to always answer "Hello world"

server(ctx => 'Hello world!');

