const express = require("express");

const {

    updateTeamMetrics
    
} = require("../controller/visualizationController");
 
const router = express.Router();
 
router.route("/updateTeamMetrics").post(updateTeamMetrics)
 
module.exports = router;