const mongoose = require('../database/connectDB');
const bcrypt = require('bcrypt');
mongoose.set('useFindAndModify', false);

const DataSchema = ({
    telegram: {
        type: String,
        required: false,
    },
    iqoption: [{
        _id: false,
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        }, 
        status: {
            type: String,
        }  
    }],
    folders: [{
        configs: {
            accType: {
                type: Boolean,
                default: false
            },
            account: {
                type: String,
            },
            telegram: {
                type: String,
            },
            value: {
                real: {
                    type: Number,
                },
                dolar: {
                    type: Number,
                },
            },
            folder: {
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                color: {
                    type: String,
                    default: "#949fb0"
                }
            }
        },
        historic: [{
            signal: {
                type: String,
            },
            value: {
                type: Number,
            },
            earnings: {
                type: Number,
            },
            status: {
                type: String,
            }
        }]
    }]
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    data: DataSchema,
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;