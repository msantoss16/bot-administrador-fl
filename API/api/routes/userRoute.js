module.exports = app => {
    const users = require('../controllers/users')();
    const sinais = require('../controllers/sinais')();
    const authMiddleware = require('../middleware/auth');
    const tokens = require('../controllers/tokens')();
    const contas = require('../controllers/contas')();
    const pastas = require('../controllers/pastas')();
    const dados = require('../controllers/dados')();

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
    app.route('/sinais/lista')
        .post(sinais.receberLista);

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
    app.route('/vincTelegram')
        .post(contas.vincTelegram);
    app.route('/vincTelegram')
        .get(contas.obterTelegram);
    app.route('/checkTelegram')
        .post(contas.checkTelegram);

    //Rota das pastas
    app.route('/folder')
        .post(pastas.novaPasta);
    app.route('/folders/')
        .get(pastas.carregarPasta);

    //Rota dos dados
    app.route('/folders/dados')
        .get(dados.receberSinaisAllFolders);
    app.route('/folder/dados')
        .post(dados.receberSinaisDFolder);
};
