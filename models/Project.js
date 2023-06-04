var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    
    name: {type: String, required: true},

    team: {type: String, required: true}, 

    deploymentFrequency: { type: Number},

    deploymentSuccessRate: {type: Number}, 

    meanTimeToResolveIssue: {type: Number},

    doraScore: {type: Number}

});

module.exports = new mongoose.model("Project",ProjectSchema);