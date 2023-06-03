const express = require("express");
const connectDB = require('./db/connection');
const { Octokit, App } = require("octokit");
const env = require('dotenv').config({path: __dirname + '/.env'});
const teamRouter = require("./router/teamRoutes");
const projectRouter = require("./router/projectRoutes");
const deploymentRouter = require("./router/deploymentRoutes");
const issueRouter = require('./router/issueRouter');

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

// let issuesReq = 'GET /repos/{owner}/{repo}/issues'

// octokit.request(issuesReq, {
//   owner: 'rajesh-ndv',
//   repo: 'authenticationMS',
//   state: 'all',
//   headers: {
//     'X-GitHub-Api-Version': '2022-11-28'
//   }
// }).then(function success(oData){
//   console.log(JSON.stringify(oData));
// }).catch(function error(oError){
//   console.log(oError);
// })

app.use("/api/team", teamRouter);

app.use("/api/project",projectRouter);

app.use("/api/deployments", deploymentRouter);

app.use("/api/issues", issueRouter);

 
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
 
module.exports = app;