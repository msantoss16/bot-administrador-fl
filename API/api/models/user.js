const mongoose = require('../database/connectDB');
const bcrypt = require('bcrypt');
mongoose.set('useFindAndModify', false);

const DataSchema = ({
    telegram: {
        type: String,
        required: false,
    },
    iqoption: [{
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        }  
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