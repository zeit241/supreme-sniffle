const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    login:{
        type: String,
        required: true,
    },
    tg_id: {
        type: Number,
        required: true,
    },
    ref_id:{
        type: Number,
        required: true,
    },
    links_info:{
        type: Array,
        default: []
    },
    redirect:{
        type: Array,
        default: []
    },
    balance:{
        type: Number,
        required: true,
        default: 0
    },
    vip:{
        type: Boolean,
        required: true,
        default: false
    },
    ban:{
        type: Boolean,
        required: true,
        default: false
    },
    ban_reason:{
        type: String,
    },
    vipDate:{
        type: String,
        required: false,
    },
    vipType:{
        type: String,
        required: false,
    },
    isAdmin:{
        type: Boolean,
        required: true,
    },
    expirience:{
        type: String,
        default:'-'
    },
    from:{
        type: String,
        default:'-'
    },
    reg_date:{
        type: Date,
    },
    isAccepted:{
        type: String,
        default: 'checking'
    },
    transactions:{
        type: Array
    },
    ref_balance:{
        type: Number
    },
    edit_mode:{
        type: Boolean,
        default: false
    },
    edit_modeType:{
        type: String,
    }
},{
    versionKey: false
})

module.exports = model('userData', userSchema)