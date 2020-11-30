const mongoose = require('mongoose');
const config = require('../../config/default.json');

mongoose.connect(config.database.link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;