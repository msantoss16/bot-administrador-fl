// Importando as dependencias
const express = require('express');
const bodyParser = require('body-parser'); // Biblioteca para conversao dos dados recebidos no crud (json)
const config = require('config');

module.exports = () => {
    const app = express();
    //setando a porta
    app.set('port', process.env.PORT || config.get('server.port'));

    //middleware
    app.use(bodyParser.json());
    
    //rotas
    require('../api/routes/userRoute')(app);
    return app;
};