var mongoose = require("mongoose");

var CommitSchema = new mongoose.Schema({
    
    name: {type: String}

});

module.exports = new mongoose.Model("Commit",CommitSchema);