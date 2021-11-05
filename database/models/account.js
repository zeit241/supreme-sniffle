const {
    Schema,
    model
} = require('mongoose')

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
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
    id: {
        type: String,
        required: false,
    },
    _2fa: {
        type: Boolean,
        required: false,
    },
    sex: {
        type: Number,
        required: false,
    },
    online: {
        type: String,
        required: false,
    },
    tg_id: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    fake: {
        type: String,
        required: false,
    },
    ip: {
        type: String,
        required: false,
    },
    pattern: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    has_mobile: {
        type: Boolean,
        required: false,
    },
    online: {
        type: Boolean,
        required: false,
    },
    gifts: {
        type: Number,
        required: false,
    },
    is_closed: {
        type: Boolean,
        required: false,
    },
    query: {
        type: Number,
        required: false,
    }
}, {
    versionKey: false
})

module.exports = model('account', userSchema)