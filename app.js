const express = require("express");
const connectDB = require('./db/connection');
const env = require('dotenv').config({path: __dirname + '/.env'});
const app = express();

app.use(express.json());

if(!env || !env.parsed || !env.parsed.MONGODB_URI){
  console.log("Data Source URL Not Found");
}else {
  connectDB(env);
}
 
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
 
module.exports = app;