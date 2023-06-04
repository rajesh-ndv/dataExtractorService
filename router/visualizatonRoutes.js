const express = require("express");

const {

    updateTeamCount
    
} = require("../controller/visualizationController");
 
const router = express.Router();
 
router.route("/updateTeamCount").post(updateTeamCount)
 
module.exports = router;