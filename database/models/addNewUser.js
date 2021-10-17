const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    login :{
        type: String,
        required: true,
    },
    tg_id: {
        type: Number,
        required: true,
    },
    reg_date: {
        type: Date,
        required: true,
    },
    ref_id:{
        type: Number,
        required: true,
        default: 0
    },
    from: {
        type: String,
        required: true,
        default: ''
    },
    expirience:{
        type: String,
        required: true,
        default: ''
    },
    isAccepted:{
        type: String,
        required: true,
        default: 'checking',
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false,
    }

},{
    versionKey: false
})

module.exports = model('User', userSchema)