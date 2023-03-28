const deploymentService = require("../services/deploymentService");

exports.crawlDeploymentInfo = async function (req,res) {

    try {

        let response = await deploymentService.crawlDeploymentsForAllTeams();

        res.status(200).json({ data: response});


    } catch (err) {

        res.status(500).json({ error: err.message });

    }

}