module.exports = app => {
    const users = require('../controllers/users')();
    const sinais = require('../controllers/sinais')();
    const authMiddleware = require('../middleware/auth');
    const tokens = require('../controllers/tokens')();
    const contas = require('../controllers/contas')();

    //Rotas dos usuarios
    app.route('/users')
        .get(users.showUsers);
    app.route('/users/:id')
        .get(users.showUser);
    app.route('/register')
        .post(users.cadUser);
    app.route('/users/:id')
        .put(users.updateUser);
    app.route('/users/:id')
        .delete(users.deleteUser);
    app.route('/authenticate')
        .post(users.logarUser);
    app.route('/forgot_password')
        .post(users.forgotPassword);
    app.route('/reset_password/:token')
        .post(users.resetPassword);

    //Rotas dos sinais
    app.route('/sinais')
        .post(sinais.receberSinal);

    //Rota dos tokens
    app.use(authMiddleware);
    app.route('/token')
        .get(tokens.obterId);

    //Rota das contas
    app.route('/check/')
        .post(contas.check);
    app.route('/vincEmail')
        .post(contas.vincEmail);
    app.route('/vincEmail')
        .get(contas.obterEmails);
    app.route('/vincEmail/:id')
        .delete(contas.desvEmail);
};
