const express = require("express");
const connectDB = require('./db/connection');
const { Octokit, App } = require("octokit");
const env = require('dotenv').config({path: __dirname + '/.env'});

const app = express();

app.use(express.json());

if(!env || !env.parsed || !env.parsed.MONGODB_URI){
  console.log("Data Source URL Not Found");
}else {
  connectDB(env);
}

const octokit = new Octokit({
  auth: env.parsed.GITHUB_TOKEN
});

// let commitReq = "GET /repos/{owner}/{repo}/commits";

// let deploymentReq = "GET /repos/{owner}/{repo}/deployments";

// octokit.request(commitReq, {
//   owner: 'rajesh-ndv',
//   repo: 'authenticationMS',
//   headers: {
//     'X-GitHub-Api-Version': '2022-11-28'
//   }
// }).then(function success(oData){
//   console.log(JSON.stringify(oData));
// }).catch(function error(oError){
//   console.log(oError);
// })


 
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
 
module.exports = app;