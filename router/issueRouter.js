const express = require("express");

const {

    crawlIssueInfo
    
} = require("../controller/issueController");
 
const router = express.Router();
 
router.route("/crawlIssues").get(crawlIssueInfo)
 
module.exports = router;