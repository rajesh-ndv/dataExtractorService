var mongoose = require('mongoose');

var DeploymentSchema = new mongoose.Schema({
    
    name: {type: String, required: true}

});

module.exports = new mongoose.Model("Deployment",DeploymentSchema);