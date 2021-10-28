const {names,links} = require('../objects')
module.exports = tools = {
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
    GetDaysCount(date){
        return Math.round((Date.parse(new Date()) - Date.parse(date))/86400000)
    },
    GetDateFormat(date){
        return `${new Date(date).getDay().toString().length==1? '0'+new Date(date).getDay():new Date(date).getDay()}.${new Date(date).getMonth().toString().length==1? '0'+new Date(date).getMonth():new Date(date).getMonth()}.${new Date(date).getFullYear()} / ${new Date(date).getHours().toString().length==1? '0'+new Date(date).getHours():new Date(date).getHours()}:${new Date(date).getMinutes().toString().length==1? '0'+new Date(date).getMinutes():new Date(date).getMinutes()}`
    },
    VipCheck(date){
        return new Date(date) < new Date()
    }
}

