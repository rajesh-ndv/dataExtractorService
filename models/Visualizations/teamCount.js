const mongoose = require("mongoose");

const TeamCountSchema = new mongoose.Schema({
    
    count: { type: Number, required: true }

});

module.exports = mongoose.model("TeamCount",TeamCountSchema);