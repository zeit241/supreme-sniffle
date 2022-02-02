const {names,links} = require('../objects')
module.exports = tools = {
    CreateReplayList(type){
        let array = []
        return array
    },
    ISODATE(oSignDate) {
        "use strict";
        return oSignDate.getFullYear().toString() + (1 + oSignDate.getMonth()).toString() + oSignDate.getDate().toString() + "T" + oSignDate.getHours().toString() + oSignDate.getMinutes().toString() + oSignDate.getSeconds().toString() + (oSignDate.getTimezoneOffset() > 0 ? "-" : "+") + ("0000" + (-1 * oSignDate.getTimezoneOffset() / 60) * 100).toString().substr(-4, 4);
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
        return `${new Date(date).getDate().toString().length==1? '0'+new Date(date).getDate():new Date(date).getDate()}.${(new Date(date).getMonth()+1).toString().length==1? '0'+(new Date(date).getMonth()+1):(new Date(date).getMonth()+1)}.${new Date(date).getFullYear()} / ${(new Date(date).getHours()+3).toString().length==1? '0'+(new Date(date).getHours()+3):(new Date(date).getHours()+3)}:${new Date(date).getMinutes().toString().length==1? '0'+new Date(date).getMinutes():new Date(date).getMinutes()}`
    },
    VipCheck(date){
        return new Date(date) < new Date()
    }
}

