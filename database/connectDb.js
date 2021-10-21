const mongoose = require('mongoose')
const dotenv = require('dotenv')
module.exports =function connect(){
    mongoose.connect(process.env.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) throw err
        console.log('База данных успешно подключена')
    })
}