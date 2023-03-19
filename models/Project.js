var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    
    name: {type: String, required: true}

});

module.exports = new mongoose.Model("Project",ProjectSchema);