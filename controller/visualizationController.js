const visualizationService = require("../services/visualizationService");

exports.updateTeamMetrics = async function (req,res) {

    try {

        let response = await visualizationService.createTeamMetrics()

        if(response.status && response.status == "SUCCESS") {

            res.status(200).json({ data: response});

        } else {

            res.status(400).json({ data: response});

        }


      } catch (err) {

        res.status(500).json({ error: err.message });

      }

}