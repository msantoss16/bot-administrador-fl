module.exports = () => {
    const controller = {};
    const User = require('../models/user');
    
    controller.showUsers = (req, res) => {
        res.send('oilinda');
    };

    controller.showUser = (req, res) => {
        res.send('ok');
    };

    controller.cadUser = async (req, res) => {
        const {email} = req.body;
        let emailc = await User.findOne({email});

        try {
            if (emailc) {
                return res.status(400).send({error: 'O email ja existe'});
            };

            const user = await User.create(req.body);

            user.password = undefined;

            return res.send(user);
        } catch (err) {
            return res.status(400).send({error: 'Erro ao se registrar'});
        }
    };

    controller.deleteUser = (req, res) => {
        res.send('ok');
    };

    controller.updateUser = (req, res) => {
        res.send('ok');
    };
    return controller;
};