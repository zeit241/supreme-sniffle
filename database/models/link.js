const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    link: {
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    query:{
        type: Array,
        required: true,
    }
}, {
    versionKey: false
})

module.exports = model('link', userSchema)