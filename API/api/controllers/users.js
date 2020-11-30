module.exports = () => {
    const controller = {};
    const User = require('../models/user');
    const bcrypt = require('bcrypt');
    
    controller.showUsers = async (req, res) => {
        try {
            await User.find()
                .then(function(dados){
                    return res.send({Users: dados})
                })
        } catch (err) {
            console.log(err);
        }
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
            console.log(err);
            return res.status(400).send({error: 'Erro ao se registrar'});
        }
    };

    controller.deleteUser = (req, res) => {
        res.send('ok');
    };

    controller.updateUser = (req, res) => {
        res.send('ok');
    };

    controller.logarUser = async (req, res) => {
        try {
            const {email, password } = req.body;
            const user = await User.findOne({email}).select('+password');
        
            if(!user)
                return res.status(400).send({error: 'Usuario não encontrado'});
    
            if (!await bcrypt.compare(password, user.password))
                return res.status(400).send({error: 'Senha invalida'});
    
            user.password = undefined;
    
            res.send(user);

        } catch (error) {
            return res.status(400).send({error})
        }
    };
    return controller;
};