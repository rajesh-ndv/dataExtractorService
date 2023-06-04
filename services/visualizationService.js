const teamCountModel = require("../models/Visualizations/teamCount")

const teamModel = require("../models/Team");

exports.createTeamCount = async function() {

    await teamCountModel.deleteMany({})

    const size = await teamModel.countDocuments();

    let document = await teamCountModel.create({
        count: size
    })

    let response = {};

    response.status = "SUCCESS";

    response.teamCount= document;

    return response;

}