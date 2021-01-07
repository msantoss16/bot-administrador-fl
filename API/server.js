const app = require('./config/express')();
const port = app.get('port');


//Rodar aplicacao
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


app.get('/', (req, res) => {
    res.send('API para manipulacao de dados do bot do telegram, bot do iqoption e site');
});

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
//     app.use(cors());
//     next();
// });
