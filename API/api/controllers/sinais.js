module.exports = () => {
    const Sinal = require('../models/sinal');
    const User = require('../models/user');
    const controller = {};
    const request = require('request');
    const scheduler = require('node-schedule');
    dataa = new Date(2021, 1, 21, 21, 20, 00);
    const b = scheduler.scheduleJob(dataa, () => {

    });
    async function salvarLista(jsonLista, userid, configs) {
        dataAtual = new Date()
        for (dado in jsonLista){
            horas = jsonLista[dado].horario;
            dataAtual.setHours(parseInt(horas[0]+horas[1]), parseInt(horas[3]+horas[4]), 0);
            await Sinal.create({
                configsSignal: {
                    periodo: jsonLista[dado].periodo,
                    paridade: jsonLista[dado].paridade,
                    horario: dataAtual,
                    sinal: jsonLista[dado].sinal,
                    gale: jsonLista[dado].gale 
                },
                configsFolder: {
                    valor: configs.valor,
                    account: configs.account,
                    accType: configs.accType
                },
                userid,
            })
                .then(function(sinal) {
                    scheduler.scheduleJob(sinal.configsSignal.horario, () => {
                        request({
                            url: 'http://localhost:5000/sinal',
                            method: 'POST',
                            json: {
                                login: {
                                    email: configs.account,
                                    password: configs.password
                                },
                                sinal: {
                                    paridade: sinal.configsSignal.paridade,
                                    sinal: sinal.configsSignal.sinal,
                                    periodo: String(sinal.configsSignal.periodo)
                                },
                                configs: {
                                    valor: sinal.configsFolder.valor,
                                }
                            }
                        }, function(error, response, body) {
                            status = body.replace('\r\n', '').split('!');
                            if (status[0] == "True") {
                                Sinal.findByIdAndUpdate(sinal.id, {
                                    'configsFolder.status': 1,
                                    signalId: status[1]
                                }).exec();
                            } else {
                                Sinal.findByIdAndUpdate(sinal.id, {
                                    'configsFolder.status': 3
                                }).exec();
                            }
                        });
                    });
                    User.findByIdAndUpdate(userid, {
                        '$addToSet': {
                            'data.folders.0.sinaisid': sinal.id
                        }
                    }, function(err, result) {
                        if (err) {
                            return 400;
                        } else {
                            return 200;
                        }
                    }).exec();
                }).catch(function (err) {
                    return 400;
                });

        }
    }

    controller.receberLista = async (req, res) => {
        let {lista, userid} = req.body;
        console.log(userid);
        console.log(lista)
        User.findById(userid, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                try {
                    var fValue, account, accType, password;
                    if (user.data.configs.defaultFolder) {
                        let defaultFolder = user.data.configs.defaultFolder;
                        for (folderacc in user.data.folders) {
                            if (folderacc._id == defaultFolder) {
                                fValue = folderacc.configs.value.real;
                                account = folderacc.configs.account;
                                accType = folderacc.configs.accType;
                                for (acc in user.data.iqoption) {
                                    if (user.data.iqoption[acc].email == account) {
                                        password = user.data.iqoption[acc].password;
                                    }
                                } 
                                break
                            }
                        }
                    } else {
                        fValue = user.data.folders[0].configs.value.real;
                        account = user.data.folders[0].configs.account;
                        accType = user.data.folders[0].configs.accType
                        for (acc in user.data.iqoption) {
                            if (user.data.iqoption[acc].email == account) {
                                password = user.data.iqoption[acc].password;
                            }
                        } 
                    }
                    salvarLista(lista, userid, {valor: fValue, account, accType, password})
                    return res.sendStatus(200);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    };

    controller.receberGanho = async (req, res) => {
        let {sinalId, signalId} = req.body;

    };

    controller.receberSinal = async (req, res) => {
        try {
            //const sinal = await Sinal.create(req.body);
            console.log(req.body);
            return res.status(200).send(req.body);
        } catch (err) {
            console.log(err);
            return res.status(400).send({error: 'Erro ao se registrar'});
        }
    };

    return controller;
};