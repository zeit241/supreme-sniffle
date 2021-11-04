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
        type: String,
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
    sex:{
        type: Number,
    },
    online:{
        type: String,
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
    pattern:{
        type: String,
    },
    type:{
        type: String,
        required: true,
    },
    first_name:{
        type: String,
    },
    last_name:{
        type: String,
    },
    has_mobile:{
        type: Boolean,
    },
    online:{
        type: Boolean,
    },
    gifts:{
        type: Number
    },
    is_closed:{ type: Boolean},
    query:{
        type: Number,
    }
},{
    versionKey: false
})

module.exports = model('account', userSchema)