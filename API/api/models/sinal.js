const mongoose = require('../database/connectDB');

const SinalSchema = ({
    periodo: {
        type: Number,
        required: false,
    },
    paridade: {
        type: String,
        required: true,
    },
    horario: {
        type: Date,
    },
    sinal: {
        type: String,
        required: true
    },
    gale: {
        type: Number,
        required: false,
    },
    win: {
        type: Boolean,
        required: false,
    }
});

const Sinal = mongoose.model('Sinal', SinalSchema);
module.exports = Sinal;