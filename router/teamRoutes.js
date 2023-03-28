const express = require("express");

const {

    createOrUpdateTeam
    
} = require("../controller/teamController");
 
const router = express.Router();
 
router.route("/team").post(createOrUpdateTeam)
 
module.exports = router;