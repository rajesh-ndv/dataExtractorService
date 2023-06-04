const mongoose = require("mongoose");

const OrganizationMetricSchema = new mongoose.Schema({
    
    count: { type: Number},

    deploymentFrequency: { type: Number, default: 0 },

    deploymentSuccessRate: {type: Number, default: 0 }, 

    meanTimeToResolveIssue: {type: Number, default: 0 },

    unCompliantTeams: {type: Number, default: 0 }, 

    doraScore: {type: Number, default: 0 }

});

module.exports = mongoose.model("OrganizationMetrics",OrganizationMetricSchema);