module.exports = () => {
    const controller = {};
    const User = require('../models/user');
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');
    const jwt = require('jsonwebtoken');
    const authConfig = require('../../config/auth');
    const nodemailer = require('nodemailer');
    const mailerConfig = require('../../config/nodemailer');


    function generateToken(params = {}) {
        return token = jwt.sign(params, authConfig.secret, {
            expiresIn: 86400,
        });
    };
    
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
        console.log(req.body);
        const {email} = req.body;
        let emailc = await User.findOne({email});

        try {
            if (emailc) {
                return res.status(400).send({error: 'O email ja existe'});
            };

            const user = await User.create(req.body);

            user.password = undefined;

            return res.send({
                user,
                token: generateToken({ id: user.id }),
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({error: 'Erro ao se registrar'});
        }
    };

    controller.deleteUser = (req, res) => {
        User.deleteOne({
            "_id":req.params.id
        }, (err, response) => {
            if (err) {throw err;}
        });
        return res.status(200).send({concluido: true});
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
    
            res.send({
                user,
                token: generateToken({ id: user.id }),
            });
        } catch (error) {
            return res.status(400).send({error})
        }
    };

    controller.forgotPassword = async (req, res) => {
        const {email} = req.body;
        try {
            const user = await User.findOne({email});
            if(!user)
                return res.status(400).send({error: 'User not found' });
            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);
            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                }
            });
            const transporter = nodemailer.createTransport({
                host: mailerConfig.host,
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: mailerConfig.user,
                    pass: mailerConfig.pass
                },
                tls: { rejectUnauthorized: false }
            });
            const mailOptions = {
                from: 'matheus@gdbot.com',
                to: 'trovaodo@gmail.com',
                subject: 'Alteração de Senha',
                html: `<h1>Alterar senha</h1><p>Para alterar sua senha <a href=${mailerConfig.linkAlt}${token}>Clique aqui</a> ou copie o link: ${mailerConfig.linkAlt}${token}</p>`
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send({error: 'Error on send email, try again!'});
                } else {
                  res.status(200).send({sucesso: 'Enviado com sucesso!'});
                }
            });
        } catch (err) {
            console.log(error); 
            res.status(400).send({error: 'Erro on forgot password, try again'});
        }
    };

    controller.resetPassword = async (req, res) => {
        let token = req.params.token
        
    };

    return controller;
};