const mongoose = require("mongoose");

const OrganizationMetricSchema = new mongoose.Schema({
    
    count: { type: Number},

    deploymentFrequency: { type: Number},

    deploymentSuccessRate: {type: Number}, 

    meanTimeToResolveIssue: {type: Number},

    unCompliantTeams: {type: Number}, 

    doraScore: {type: Number}

});

module.exports = mongoose.model("OrganizationMetrics",OrganizationMetricSchema);