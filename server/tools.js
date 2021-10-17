const bot = require('../createBot')

const tools = {
    CreateNewMessageWithKeyboard (id, text, keyboard){
        let options = {
            reply_markup: {
                keyboard: keyboard,
                resize_keyboard: true,
            },
            parse_mode: 'HTML'
        }
        bot.sendMessage(id, text, options)
    },
    CreateNewMessageWithInlineKeyboard (id, text, keyboard){
        let options = {
            reply_markup: {
                inline_keyboard: keyboard,
                resize_keyboard: true,
            },
            parse_mode: 'HTML'
        }
        bot.sendMessage(id, text, options)
    },
     GetStringDate(date){
       let result = (date - new Date())+1000
       let seconds = Math.floor((result/1000)%60);
       let minutes = Math.floor((result/1000/60)%60);
       let hours = Math.floor((result/1000/60/60)%24);
       let days = Math.floor(result/1000/60/60/24);
       if (seconds < 10) seconds = '0' + seconds;
       if (minutes < 10) minutes = '0' + minutes;
       if (hours < 10) hours = '0' + hours;
       if(days == 0){
           return `${hours} час(ов) ${minutes} минут ${seconds} секунд`
       }else{
            return `${days} дней ${hours} час(ов) ${minutes} минут ${seconds} секунд`
       }
    }
}

module.exports = tools