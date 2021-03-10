const mongoose = require('../database/connectDB');
const { Schema } = require('../database/connectDB');
const User = require('./user');

const SignalSchema = new mongoose.Schema({
    configsSignal: {
        periodo: {
            type: Number,
            required: false,
            default: 5,
        },
        paridade: {
            type: String,
            required: true,
        },
        horario: {
            type: Date,
            required: true,
        },
        sinal: {
            type: String,
            required: true,
        },
        gale: {
            type: Number,
            default: 0
        },
    },
    configsFolder: {
        valor: {
            type: Number,
            get: getPrice,
            set: setPrice,
        },
        account: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            default: 0
        },
        win: {
            type: String,
            default: "0"
        },
        gale: {
            type: Number,
            required: false,
        },
        accType: {
            type: Boolean,
            default: false,
        }
    },
    signalId: {
        type: String,
        required: false,
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}


const Signal = mongoose.model('Signal', SignalSchema);
module.exports = Signal;