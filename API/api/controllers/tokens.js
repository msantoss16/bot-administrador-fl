module.exports = () => {
    const controller = {};
    const authMiddleware = require('../middleware/auth');
    
    controller.obterId = async (req, res) => {
        res.send({user: req.userId});
    };
    
    return controller;
}