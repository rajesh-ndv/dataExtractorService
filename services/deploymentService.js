const deploymentModel = require("../models/Deployment");

const projectModel = require("../models/Project");

const teamModel = require("../models/Team");

const { Octokit, App } = require("octokit");

const deploymentReq = "GET /repos/{owner}/{repo}/deployments";

const deploymentStatusReq = "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses";

const crypto = require('crypto');

const algorithm = "aes256";

const key = "MY_SECRET_KEY";


async function processDeploymentStatusInformation(oOctokit,sDeploymentId,sAuthor,sRepo) {

    return await oOctokit.request(deploymentStatusReq, {

        owner: sAuthor,

        repo: sRepo,

        deployment_id: sDeploymentId,

        headers: {

          'X-GitHub-Api-Version': '2022-11-28'

        }

    });

}

async function processDeploymentInformationForProject(oProject,oTeam){

    let oFinalResults = [];

    var decipher = crypto.createDecipher(algorithm, key);

    var decrypted = decipher.update(oTeam.token, 'hex', 'utf8') + decipher.final('utf8');

    let octokit = new Octokit({

        auth: decrypted

    });

    let oDeploymentResult = await octokit.request(deploymentReq, {

        owner: oTeam.author,

        repo: oProject.name,

        headers: {

          'X-GitHub-Api-Version': '2022-11-28'

        }

    });

    if(oDeploymentResult.data!=null && Array.isArray(oDeploymentResult.data)) {

        for(let i=0;i<oDeploymentResult.data.length;i++){

            let oDeploymentStatuses = await processDeploymentStatusInformation(octokit,oDeploymentResult.data[i].id,oTeam.author,oProject.name);

            for(let j=0;j<oDeploymentStatuses.data.length;j++){

                let oDeploymentFinalObject = createDeploymentInstance(oDeploymentResult.data[i],oDeploymentStatuses.data[j]);

                oFinalResults.push(oDeploymentFinalObject);

            }

        }

    }
    
    return oFinalResults;

}

function createDeploymentInstance(oDeploymentResult,oDeploymentStatus) {

    let oDeploymentObject = {};

    oDeploymentObject.deploymentId = oDeploymentResult.id;

    oDeploymentObject.statusId = oDeploymentStatus.id;

    oDeploymentObject.status = oDeploymentStatus.state;

    oDeploymentObject.creator = oDeploymentStatus.creator.login;

    oDeploymentObject.environment = oDeploymentResult.environment;

    oDeploymentObject.created = oDeploymentStatus.created_at;

    oDeploymentObject.updated = oDeploymentStatus.updated_at;

    oDeploymentObject.originalEnvironment = oDeploymentResult.original_environment;

    oDeploymentObject.transientEnvironment = oDeploymentResult.transient_environment;

    oDeploymentObject.productionEnvironment = oDeploymentResult.production_environment;

    return oDeploymentObject;

}

async function processDeploymentForTeam(oTeam){

    let oFilter = { team : oTeam._id };

    let aProjects = await projectModel.find(oFilter);

    let aResult = [];

    if(aProjects!=null && Array.isArray(aProjects)){

        for(let i=0;i<aProjects.length;i++){

            let oResult = await processDeploymentInformationForProject(aProjects[i],oTeam);

            aResult.push(oResult);

        }

    }

    return aResult;

}


exports.crawlDeploymentsForAllTeams = async function(){

    let aTeams = await teamModel.find();

    let aDeployments = [];

    if(aTeams!=null && Array.isArray(aTeams)){

        for(let i=0;i<aTeams.length;i++){

            let oResults = await processDeploymentForTeam(aTeams[i]);
    
            aDeployments.push(oResults);

        }

    }

    let flattendOneD = [].concat(...aDeployments);

    let flattenedTowD = [].concat(...flattendOneD);

    updateDbAsync(flattenedTowD);

    return aDeployments;

}

function updateDbAsync(aDeploymentDocuments) {

    for(let i=0;i<aDeploymentDocuments.length;i++){

        let oFilter = {deploymentId: aDeploymentDocuments[i].deploymentId,statusId: aDeploymentDocuments[i].statusId};

        deploymentModel.findOneAndUpdate(oFilter,aDeploymentDocuments[i],{

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