var mongoose = require('mongoose');


var TeamSchema = new mongoose.Schema({

    name: { type:String, required:true }, 

    token: { type:String, required:true },

    author: { type:String, required:true },

    uncompliantProjects: { type: String},

    deploymentFrequency: { type: Number},

    deploymentSuccessRate: {type: Number}, 

    meanTimeToResolveIssue: {type: Number},

    doraScore: {type: Number}
    
});

module.exports = mongoose.model("Team", TeamSchema);
