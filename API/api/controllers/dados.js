module.exports = () => {
    const Signal = require('../models/sinal');
    const User = require('../models/user');
    const controller = {};

    controller.receberSinaisAllFolders = async (req, res) => {
        await User.findOne({_id: req.userId}).populate('data.folders.sinaisid').then(function(dados) {return res.send(dados)})
    };

    controller.receberSinaisDFolder = async (req, res) => {
        let {folderId} = req.body; 
        await User.findOne({_id: req.userId}, {'data.folders._id': folderId}).populate('data.folders.sinaisid').then(function(dados) {return res.send(dados)})
    };
    
    return controller;
};