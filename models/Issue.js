var mongoose = require("mongoose");

var IssueSchema = new mongoose.Schema({

    issueId: {type: String, required: true},
    
    title: {type: String},

    name: {type: String},

    description: {type: String},

    state: {type: String},

    assignee: {type: String},

    createdAt: {type: Date, required: true},

    closedAt: {type: Date}

});

module.exports = new mongoose.model("Issue",IssueSchema);