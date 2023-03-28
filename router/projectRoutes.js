const express = require("express");

const {

    createOrUpdateProject
    
} = require("../controller/projectController");
 
const router = express.Router();
 
router.route("/project").post(createOrUpdateProject)
 
module.exports = router;