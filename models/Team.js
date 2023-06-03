var mongoose = require('mongoose');


var TeamSchema = new mongoose.Schema({

    name: { type:String, required:true }, 

    token: { type:String, required:true },

    author: { type:String, required:true }
    
});

module.exports = mongoose.model("Team", TeamSchema);
