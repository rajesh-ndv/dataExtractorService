const issueService = require("../services/issueService")

exports.crawlIssueInfo = async function (req,res) {

    try {

        let response = await issueService.crawlIssuesForAllTeams();

        res.status(200).json({ data: response});


    } catch (err) {

        res.status(500).json({ error: err.message });

    }

}