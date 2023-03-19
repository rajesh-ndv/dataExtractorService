var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    
    name: {type: String, required: true},

    deployments: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Deployment'

    }],

    commits: [{

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Commit'

    }]

});

module.exports = new mongoose.Model("Project",ProjectSchema);