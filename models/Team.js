var mongoose = require('mongoose');


var TeamSchema = new mongoose.Schema({

    name: { type:String, required:true }, 

    token: { type:String, required:true },

    author: { type:String, required:true },

    projects: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Project'

    }],

    deployments: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Deployment'

    }]
    
});

module.exports = mongoose.model("Team", TeamSchema);
