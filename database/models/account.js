const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String, 
        required: true,
    },
    token:{
        type: Number,
        required: false,
    },
    friends: {
        type: Number,
        required: false,
    },
    followers: {
        type: Number,
        required: false,
    },
    id:{
        type: String,
        required: false,
    },
    _2fa:{
        type: Boolean,
        required: false,
    },
    tg_id: {
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    fake:{
        type: String,
    },
    ip:{
        type: String,
    },
    type:{
        type: String,
        required: true,
    }
},{
    versionKey: false
})

module.exports = model('account', userSchema)