module.exports = app => {
    const users = require('../controllers/users')();
    const sinais = require('../controllers/sinais')();

    //Rotas dos usuarios
    app.route('/users')
        .get(users.showUsers);
    app.route('/users/:id')
        .get(users.showUser);
    app.route('/users')
        .post(users.cadUser);
    app.route('/users/:id')
        .put(users.updateUser);
    app.route('/users/:id')
        .delete(users.deleteUser);
    app.route('/logar')
        .post(users.logarUser);

    //Rotas dos sinais
    app.route('/sinais')
        .post(sinais.receberSinal);
};
