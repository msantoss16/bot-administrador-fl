// Importando as dependencias
const express = require('express');
const bodyParser = require('body-parser'); // Biblioteca para conversao dos dados recebidos no crud (json)
const config = require('config');
const cors = require('cors');

module.exports = () => {
    const app = express();
    //setando a porta
    app.set('port', process.env.PORT || config.get('server.port'));

    //middleware
    app.use(bodyParser.json());
    app.use(cors());
    app.use((req, res, next) => {
        //Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
        res.header("Access-Control-Allow-Origin", "*");
        //Quais são os métodos que a conexão pode realizar na API
        console.log('cors em ação');
        res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
        app.use(cors());
        next();
    });
    
    //rotas
    require('../api/routes/userRoute')(app);
    return app;
};