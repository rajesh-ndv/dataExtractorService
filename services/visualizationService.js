const organizationCountModel = require("../models/Visualizations/organizationCount")

const teamModel = require("../models/Team");

const deploymentModel = require("../models/Deployment");

const issueModel = require("../models/Issue");

const projectModel = require("../models/Project");

function calculateDeploymentFrequency(deployments) {

    const deploymentCount = deployments.length;
    
    if (deploymentCount === 0) {

      return 0;

    }

    deployments.sort((a, b) => a.created - b.created);
    
    const firstDeploymentTime = new Date(deployments[0].created);

    const lastDeploymentTime = new Date(deployments[deploymentCount - 1].created);
    
    const timeDiffInDays = Math.ceil((lastDeploymentTime - firstDeploymentTime) / (1000 * 60 * 60 * 24));
    
    return deploymentCount / timeDiffInDays;

}

function calculateDeploymentSuccessRate(deployments) {

    const totalDeployments = deployments.length;
    
    if (totalDeployments === 0) {

      return 0;

    }
    
    const successfulDeployments = deployments.filter(deployment => deployment.state === 'success').length;
    
    return (successfulDeployments / totalDeployments) * 100;
}

async function calculateMTTR(issues) {
  
    let totalMTTR = 0;

    for (const issue of issues) {

        const createdAt = issue.createdAt.getTime(); 

        const closedAt = issue.closedAt.getTime(); 

        const mttr = closedAt - createdAt; 
        
        totalMTTR += mttr;
    }

    const meanMTTR = totalMTTR / issues.length;

    const meanMTTRInHours = meanMTTR / (1000 * 60 * 60);

    return meanMTTRInHours;
   
}
 
async function processMetricForProject(oProject) {

    let oFilter = { projectName : oProject.name };

    let aDeployments = await deploymentModel.find(oFilter);

    let aIssues = await issueModel.find(oFilter);

    let deploymentFrequency = calculateDeploymentFrequency(aDeployments);

    let successRate = calculateDeploymentSuccessRate(aDeployments);

    let mttRepair = calculateMTTR(aIssues);

    oProject.deploymentFrequency = deploymentFrequency;

    oProject.deploymentSuccessRate = successRate;

    oProject.meanTimeToResolveIssue = mttRepair;

    oProject.doraScore = 0.2*deploymentFrequency + 0.4*successRate + 0.4*mttRepair;

    return oProject;

}


async function processMetricsForTeam(oTeam) {

    let oFilter = { team : oTeam.name };

    let aProjects = await projectModel.find(oFilter);

    let aProjectResults = [];

    if(aProjects!=null && Array.isArray(aProjects)){

        for(let i=0;i<aProjects.length;i++){

            let oResult = await processMetricForProject(aProjects[i]);

            aProjectResults.push(oResult);

        }

    }

    let depFreq = 0;

    let depSuccessRate = 0;

    let mttRate = 0;

    let projects = []

    for(var i=0;i<aProjects.length;i++) {

        let projectFilter = {"name": aProjects[i].name};

        let projectDocument = await projectModel.findOneAndUpdate(projectFilter,aProjects[i],{

            returnOriginal: false,
    
            new: true,
    
            upsert: true 
    
        });

        projects.push(projectDocument);

        depFreq = depFreq + projectDocument.deploymentFrequency ?? 0;

        depSuccessRate = depSuccessRate + projectDocument.deploymentSuccessRate ?? 0;

        mttRate = mttRate + projectDocument.meanTimeToResolveIssue ?? 0;

    }

    if(projects.length>0) {

        depFreq = depFreq/projects.length;

        depSuccessRate = depSuccessRate/projects.length;

        mttRate = mttRate/projects.length;

    }

    oTeam.deploymentFrequency = depFreq;

    oTeam.deploymentSuccessRate = depSuccessRate;

    oTeam.meanTimeToResolveIssue = mttRate;

    oTeam.doraScore = 0.2*depFreq + 0.4*depSuccessRate + 0.4*mttRate;

    if(oTeam.doraScore<5) {

        if(oTeam.uncompliantProjects!=null) {

            oTeam.uncompliantProjects = 1+oTeam.uncompliantProjects;

        } else {

            oTeam.uncompliantProjects = 0;

        }

    }

    return oTeam;

}

exports.createTeamMetrics = async function() {

    await organizationCountModel.deleteMany({})

    let aTeams = await teamModel.find();

    let aTeamResults = [];

    for(var i=0;i<aTeams.length;i++) {

        let oResult = await processMetricsForTeam(aTeams[i]);

        aTeamResults.push(oResult);

    }



    // save updated team results

    let depFreq = 0;

    let depSuccessRate = 0;

    let mttRate = 0;

    let count = 0;

    for(var i=0;i<aTeamResults.length;i++) {

        let teamDocument = await teamModel.findOneAndUpdate({name: aTeamResults[i].name},aTeamResults[i],{

            returnOriginal: false,
    
            new: true,
    
            upsert: true 
    
        }); 
        
        depFreq = depFreq + teamDocument.deploymentFrequency ?? 0;

        depSuccessRate = depSuccessRate + teamDocument.deploymentSuccessRate ?? 0;

        mttRate = mttRate + teamDocument.meanTimeToResolveIssue ?? 0;

        if(teamDocument.doraScore<5) {

            count = count+1;

        }

    }

    let n = aTeamResults.length;

    if(n==0 || n==null || n==undefined) {

        n=1;

    }

    await organizationCountModel.deleteMany({});

    let orgMetrics = {

        count: aTeamResults.length,

        deploymentFrequency: depFreq/n,

        deploymentSuccessRate: depSuccessRate/n,

        meanTimeToResolveIssue: mttRate/n,

        uncompliantProjects: count,

        doraScore: 0.2*depFreq + 0.4*depSuccessRate + 0.4*mttRate

    }

    // create organization metric and save it

    let savedData = await organizationCountModel.create(orgMetrics);

    let response = {};

    response.status = "SUCCESS";

    response.data = savedData;
   
    return response;

}