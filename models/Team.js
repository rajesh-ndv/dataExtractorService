var mongoose = require('mongoose');


var TeamSchema = new mongoose.Schema({

    name: { type:String, required:true }, 

    token: { type:String, required:true },

    author: { type:String, required:true },

    count: { type: Number, default: 0},

    uncompliantProjects: { type: Number,  default: 0 },

    deploymentFrequency: { type: Number, default: 0 },

    deploymentSuccessRate: {type: Number, default: 0 },

    meanTimeToResolveIssue: {type: Number, default: 0 },

    doraScore: {type: Number, default: 0 }
    
});

module.exports = mongoose.model("Team", TeamSchema);
