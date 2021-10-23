const bot = require('../createBot')
const {
    names,
    links,
} = require('../objects')
const tools = {
    CreateReplayList(type){
        let array = []
        
        return array
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
    },
    GetDateFormat(date){
        let x = new Date(date)
        return `${x.getDay()}.${x.getMonth()}.${x.getFullYear()} / ${x.getHours()}:${x.getMinutes()}`
    }
}

module.exports = tools