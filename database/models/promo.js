const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    promo: {
        type: String,
        required: true,
    },
    value:{
        type: String,
        required: true,
    },
    activations: {
        type: Number,
        default: 0,
        required: true,
    },
    mactivation:{
        type: Number,
        required: true,
    },
    usedBy:{
        type: Array,
    },
    type: {
        type: String,
    }
}, {
    versionKey: false
})

module.exports = model('promo', userSchema)