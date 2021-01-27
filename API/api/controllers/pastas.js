module.exports = () => {
    const tokens = require('../controllers/tokens');
    const controller = {};
    const request = require('request');
    const User = require('../models/user');

    controller.novaPasta = async (req, res) => {
        let {accType, account, telegram, value, folder} = req.body;
        console.log(folder);
        User.findByIdAndUpdate(req.userId, {
            '$pull': {
                'data.folders': {
                    configs: {
                        accType: accType,
                        account: account,
                        telegram: telegram,
                        value: value,
                        folder: {
                            name: folder.name,
                            description: folder.description,
                            color: folder.color
                        } 
                    },
                }
            }
        }, function(err, result) {
            if (err) {
                console.log(err);
                return res.status(400).send({"error": "erro"});
            } else {
                console.log(result);
                return res.status(200).send({"sucesso": true});
            }
        }).exec();
    };

    return controller;
} 
