const projectModel = require("../models/Project");

const teamModel = require("../models/Team");

function validateProject(project){

    let response = {};

    if(!project.projectName){

        response.status = "ERROR";

        response.description = "Project Name is Not Present";

    }

    return response;

}

exports.createOrUpdateProject = async function(project){

    let errorObject = validateProject(project);

    if(errorObject && errorObject.status == "ERROR") return errorObject;

    let teamFilter = { "name" : project.teamName };

    let teamDocuments = await teamModel.find(teamFilter);

    if(!teamDocuments || !Array.isArray(teamDocuments) || teamDocuments.length<=0){

        let response = {};

        response.status = "ERROR";
    
        response.description = "Team is not present";
    
        return response;

    }

    team = teamDocuments[0];


    let projectFilter = {"name": project.projectName};

    let projectPayload = {};

    projectPayload.name = project.projectName;

    projectPayload.team = team.name;


    let projectDocument = await projectModel.findOneAndUpdate(projectFilter,projectPayload,{

        returnOriginal: false,

        new: true,

        upsert: true 

    });

    let response = {};

    response.status = "SUCCESS";

    response.project = projectDocument;

    return response;

}