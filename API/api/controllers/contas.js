module.exports = () => {
    const tokens = require('../controllers/tokens');
    const controller = {};
    const request = require('request');
    const User = require('../models/user');
    
    controller.obterEmails = async (req, res) => {
        User.findById(req.userId)
            .then(dados => {
                if (dados != [])
                    res.status(200).send({emails: dados.data.iqoption.map(dado => dado.email)});
            }).catch(err => {
                res.status(400).send();
        });
    };

    controller.desvEmail = async (req, res) => {
        let email = req.params.email
        User.findByIdAndUpdate(req.userId, {
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

    controller.check = async (req, res) => {
        let {status, email, password} = req.body;
        User.findByIdAndUpdate(req.userId, {
            '$addToSet': {
                'data.iqoption': {
                    email,
                    password,
                    status,
                }
            }
        } , function(err, result) {
                if (err) {
                    console.log(err);
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

    return controller;
};