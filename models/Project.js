var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    
    name: {type: String, required: true},

    team: {type: String, required: true}, 

    deploymentFrequency: { type: Number, default: 0 },

    deploymentSuccessRate: {type: Number, default: 0 }, 

    meanTimeToResolveIssue: {type: Number, default: 0 },

    doraScore: {type: Number, default: 0 }

});

module.exports = new mongoose.model("Project",ProjectSchema);