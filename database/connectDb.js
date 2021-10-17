const mongoose = require('mongoose')
function connect(){
    mongoose.connect('mongodb+srv://jvproduction:jvprod12ws1@cluster0.w4e88.mongodb.net/DB?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, function (err) {
        if (err) throw err;
        console.log('БД подключена');
    })
}
module.exports = connect; 