const express = require("express");

const {

    crawlDeploymentInfo
    
} = require("../controller/deploymentController");
 
const router = express.Router();
 
router.route("/crawl").get(crawlDeploymentInfo)
 
module.exports = router;