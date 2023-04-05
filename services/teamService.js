const teamModel = require("../models/Team");

const crypto = require('crypto');

const algorithm = "aes256";

const key = "MY_SECRET_KEY";


function validateTeam(team){

    let response = {};

    if(!team.name){

        response.status = "ERROR";

        response.description = "Team Name is Not Present";

    }

    if(!team.token){

        response.status = "ERROR";

        response.description = "Token is Not Present";

    }

    if(!team.author){

        response.status = "ERROR";

        response.description = "Author is Not Present";

    }

    return response;

}

exports.createTeam = async function(team) {

    let errorObject = validateTeam(team);

    if(errorObject && errorObject.status == "ERROR") return errorObject;

    let filter = { "name" : team.name };

    var cipher = crypto.createCipher(algorithm, key);  

    var encrypted = cipher.update(team.token, 'utf8', 'hex') + cipher.final('hex');

    team.token = encrypted;

    let teamDocument = await teamModel.findOneAndUpdate(filter,team,{

        returnOriginal: false,

        new: true,

        upsert: true 

    });

    let response = {};

    response.status = "SUCCESS";

    response.team = teamDocument;

    return response;
    
}