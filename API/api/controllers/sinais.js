module.exports = () => {
    const Sinal = require('../models/sinal');
    const User = require('../models/user');
    const controller = {};

    async function salvarLista(jsonLista, userid, configs) {
        dataAtual = new Date()
        for (dado in jsonLista){
            horas = jsonLista[dado].horario;
            console.log(dado);
            dataAtual.setUTCHours(parseInt(horas[0]+horas[1])+3);
            dataAtual.setUTCMinutes(horas[3]+horas[4]);
            dataAtual.setUTCSeconds(0);
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
                    User.findByIdAndUpdate(userid, {
                        '$push': {
                            'data.folders[0]':{sinaisid: sinal.id}
                        }
                    }, function(err, result) {
                        console.log(result);
                    }).exec();
                    console.log(sinal.id);
                });

        }
        // User.findByIdAndUpdate(userid, {
            
        // }, function(err, result) {

        // });
    }

    controller.receberLista = async (req, res) => {
        let {lista, userid} = req.body;
        console.log(userid);
        User.findById(userid, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                try {
                    if (user.data.configs.defaultFolder) {
                        let defaultFolder = user.data.configs.defaultFolder;
                        for (folderacc in user.data.folders) {
                            if (folderacc._id == defaultFolder) {
                                let fValue = folderacc.configs.value.real;
                                let account = folderacc.configs.account;
                                let accType = folderacc.configs.accType;
                                break
                            }
                        }
                    } else {
                        let fValue = user.data.folders[0].configs.value.real;
                        let account = user.data.folders[0].configs.account;
                        let accType = user.data.folders[0].configs.accType;
                        salvarLista([{periodo: 5, paridade: 'EUR/USD', horario: '21:55', sinal: 'put', gale: 1}], userid, {valor: fValue, account, accType})
                        console.log(fValue);
                        console.log(account);
                        console.log(accType);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        });
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