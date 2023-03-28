var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    
    name: {type: String, required: true},

    team: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Team'

    },

    deployments: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Deployment'

    }],

    commits: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Commit'

    }]

});

module.exports = new mongoose.model("Project",ProjectSchema);