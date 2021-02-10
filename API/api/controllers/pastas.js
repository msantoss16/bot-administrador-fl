module.exports = () => {
    const tokens = require('../controllers/tokens');
    const controller = {};
    const request = require('request');
    const User = require('../models/user');

    controller.novaPasta = async (req, res) => {
        let {accType, account, value, folder} = req.body;
        await User.findByIdAndUpdate(req.userId, {
            '$addToSet': {
                'data.folders': {
                    configs: {
                        accType: accType,
                        account: account,
                        value: {
                            real: value.real,
                            dolar: value.dolar
                        },
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

    controller.carregarPasta = async (req, res) => {
        await User.findById(req.userId)
            .then(function(dados) {
                res.status(200).send(dados.data.folders.map(function(item){
                    return {_id: item._id, folder: item.configs.folder};
                }));
            }).catch(function(err) {
                return res.status(404).send({"error": "not-found"});
            });
    }

    return controller;
} 
