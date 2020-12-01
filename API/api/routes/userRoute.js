module.exports = app => {
    const controller = require('../controllers/users')();

    app.route('/users')
        .get(controller.showUsers);
    app.route('/users/:id')
        .get(controller.showUser);
    app.route('/users')
        .post(controller.cadUser);
    app.route('/users/:id')
        .put(controller.updateUser);
    app.route('/users/:id')
        .delete(controller.deleteUser);
    app.route('/logar')
        .post(controller.logarUser);
};
