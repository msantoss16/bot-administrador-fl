const { findByIdAndUpdate } = require('../models/user');

module.exports = () => {
    const tokens = require('../controllers/tokens');
    const controller = {};
    const request = require('request');
    const User = require('../models/user');
    
    controller.obterEmails = async (req, res) => {
        await User.findById(req.userId)
            .then(dados => {
                if (dados != [])
                    res.status(200).send({emails: dados.data.iqoption.map(dado => dado.email)});
            }).catch(err => {
                res.sendStatus(400);
        });
    };

    controller.desvEmail = async (req, res) => {
        let email = req.params.email
        await User.findByIdAndUpdate(req.userId, {
            '$pull': {
                'data.iqoption.email': email
            }
        }, {arrayFilters: [{email}]} ,function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        }).exec();
    };

    controller.vincEmail = async (req, res) => {
        let {email, password, token} = req.body;
        request({
            url: 'http://localhost:5000/check',
            method: 'POST',
            json: {
                email: email,
                password: password,
                token: token
            }
        }, function(error, response, body) {
            return res.status(200).send(body);
        });
    };

    controller.obterTelegram = async (req, res) => {
        await User.findById(req.userId)
            .then(dados => {
                if (dados != [])
                    res.status(200).send({number: dados.data.telegram});
            }).catch(err => {
                res.sendStatus(400);
        });
    };

    controller.vincTelegram = async (req, res) => {
        let {number} = req.body;
        console.log(number[0])
        if (number[0] == '+') {number = number.slice(1)}
        await User.findByIdAndUpdate(req.userId, {
            'data.telegram': number
        }, function(err, result) {
                if (err) {
                    return res.sendStatus(400);
                } else {
                    console.log(result);
                    return res.status(200).send({number});
                }
        }).exec();
    };

    controller.check = async (req, res) => {
        let {status, email, password} = req.body;
        await User.findByIdAndUpdate(req.userId, {
            '$addToSet': {
                'data.iqoption': {
                    email,
                    password,
                    status,
                }
            }
        } , function(err, result) {
                if (err) {
                    return res.send(400);
                } else {
                    result.data.iqoption.findIndex(data => data.email == email) === -1 ? result.data.iqoption.push({
                        email,
                        password,
                        status
                    }) : status = 'exists';
                    if (status != 'exists'){
                        return res.status(200).send({data:{emails: result.data.iqoption.map(data => data.email), status}});
                    } else {
                        return res.status(200).send({data: {status}});
                    }
                }
        }).exec();
    }

    controller.checkTelegram = async (req, res) => {
        let {number, username} = req.body;
        if (username) {
            await User.findOne({'data.telegram':number}).exec()
            .then(function(result) {
                if (result)
                    return res.status(200).send({_id: result._id});
            }).catch(err => {
                console.log(err);
                return res.sendStatus(400);
            });
            await User.findOne({'data.telegram':username}).exec()
            .then(function(result) {
                if (result) {
                    return res.status(200).send({_id: result._id});
                } else {
                    return res.sendStatus(404);
                }
            }).catch(err => {
                console.log(err);
                return res.sendStatus(400);
            });
        } else {
            await User.findOne({'data.telegram':number}).exec()
            .then(function(result) {
                if (result) {
                    return res.status(200).send({_id: result._id});
                } else {
                    return res.sendStatus(404);
                }
            }).catch(err => {
                console.log(err);
                return res.sendStatus(400);
            });
        }
        //return res.sendStatus(404)
    };

    return controller;
};