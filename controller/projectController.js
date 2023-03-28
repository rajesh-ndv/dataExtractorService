const projectService = require("../services/projectService");

exports.createOrUpdateProject = async function (req,res) {

    try {

        let response = await projectService.createOrUpdateProject(req.body);

        if(response.status && response.status == "SUCCESS") {

            res.status(200).json({ data: response});

        } else {

            res.status(400).json({ data: response});

        }


      } catch (err) {

        res.status(500).json({ error: err.message });

      }

}