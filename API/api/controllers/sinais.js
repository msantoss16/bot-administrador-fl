module.exports = () => {
    const Sinal = require('../models/sinal');
    const controller = {};

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