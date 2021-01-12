module.exports = () => {
    const tokens = require('../controllers/tokens');
    const controller = {};
    const request = require('request');
    const User = require('../models/user');
    
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
            return res.status(200).send({status: body});
        });
    };

    controller.check = async (req, res) => {
        let {status} = req.body;
        console.log(req.userId);
        console.log(status);
        return res.status(200).send(status);
    }

    return controller;
};