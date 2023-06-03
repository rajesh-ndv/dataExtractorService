const { Octokit, App } = require("octokit");

const issueModel = require("../models/Issue")

const projectModel = require("../models/Project");

const teamModel = require("../models/Team");

const crypto = require('crypto');

const algorithm = "aes256";

const key = "MY_SECRET_KEY";

const issuesReq = 'GET /repos/{owner}/{repo}/issues'

async function processIssueInformationForProject(oProject,oTeam){

    let oFinalResults = [];

    var decipher = crypto.createDecipher(algorithm, key);

    var decrypted = decipher.update(oTeam.token, 'hex', 'utf8') + decipher.final('utf8');

    let octokit = new Octokit({

        auth: decrypted

    });

    let oIssueResult = await octokit.request(issuesReq, {

        owner: oTeam.author,

        repo: oProject.name,

        state: 'all',

        headers: {

          'X-GitHub-Api-Version': '2022-11-28'

        }

    });

    if(oIssueResult.data!=null && Array.isArray(oIssueResult.data)) {

        for(let i=0;i<oIssueResult.data.length;i++){

            let oIssueFinalObject = createIssueInstance(oIssueResult.data[i],oProject.name,oTeam.name);

            oFinalResults.push(oIssueFinalObject);

        }

    }
    
    return oFinalResults;

}

function createIssueInstance(oIssue,sProjectName,sTeamName) {

    let issueObject = {};

    issueObject.issueId = oIssue.id;

    issueObject.title = oIssue.title;

    if(oIssue.labels && oIssue.labels.length>=1) {

        issueObject.name = oIssue.labels[0].name;

        issueObject.description = oIssue.labels[0].description;

    }

    issueObject.state = oIssue.state;

    if(oIssue.assignee) {

        issueObject.assignee = oIssue.assignee.login;

    }

    issueObject.createdAt = oIssue.created_at;

    issueObject.closedAt = oIssue.closed_at;

    return issueObject;

}



async function precessIssuesForTeam(oTeam){

    let oFilter = { team : oTeam.name };

    let aProjects = await projectModel.find(oFilter);

    let aResult = [];

    if(aProjects!=null && Array.isArray(aProjects)){

        for(let i=0;i<aProjects.length;i++){

            let oResult = await processIssueInformationForProject(aProjects[i],oTeam);

            aResult.push(oResult);

        }

    }

    return aResult;

}

exports.crawlIssuesForAllTeams = async function () {

    let aTeams = await teamModel.find();

    let aIssues = [];

    if(aTeams!=null && Array.isArray(aTeams)){

        for(let i=0;i<aTeams.length;i++){

            let oResults = await precessIssuesForTeam(aTeams[i]);
    
            aIssues.push(oResults);

        }

    }

    let flattendOneD = [].concat(...aIssues);

    let flattenedTowD = [].concat(...flattendOneD);

    updateDbAsync(flattenedTowD);

    return aIssues;

}

function updateDbAsync(aIssueDocuments) {

    for(let i=0;i<aIssueDocuments.length;i++){

        let oFilter = {issueId: aIssueDocuments[i].issueId};

        issueModel.findOneAndUpdate(oFilter,aIssueDocuments[i],{

            returnOriginal: false,

            new: true,

            upsert: true 

        }).then(function success(oData){

            console.log("Insertion success")

        }).catch(function error(oError){

            console.log(oError);

        });

    }

}