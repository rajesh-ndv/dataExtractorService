var mongoose = require('mongoose');

var DeploymentSchema = new mongoose.Schema({
    
    deploymentId: {type: String, required: true},

    statusId: {type: String, required: true},

    status: {type: String, required: true},

    creator: {type: String, required: true},

    environment: {type: String, required: true},

    created: {type: Date},

    updated: {type: Date},

    originalEnvironment: {type: String},

    transientEnvironment: {type: Boolean},

    productionEnvironment: {type: Boolean}

});

module.exports = new mongoose.model("Deployment",DeploymentSchema);