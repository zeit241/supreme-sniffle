require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bot = require('./createBot')
const bd = require('./database/connectDb')()
const isAuth = require('./middleware/AuthCheck')
require('./eventHandler')
const app = express()

app.use(cors());
app.options('*', cors());
app.use(express.json({extended: true})) 
app.use('/api/', require('./server/routes/routes'))

app.listen(3000, ()=>{
  console.log('Сервер запущен')
})


bot.onText(/\/start/, (msg) => {
  isAuth(msg)
})

bot.onText(/Подать заявку/,async (msg) => {
  if(isAuth){
    bot.sendMessage(msg.chat.id, '1. Был ли у тебя опыт в фишинге?', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: "Да",
            callback_data: "experiance_true"
          }, {
            text: "Нет",
            callback_data: "experiance_false"
          }],
        ]
      }
    })
  }else{

  }
    

  
})
// NTBA_FIX_319 = 1
// db = mongodb+srv://jvproduction:jvprod12ws1@cluster0.w4e88.mongodb.net/DB?retryWrites=true&w=majority
// Bot = 2049069473:AAHir3pfuODtgD7thDmk9l9At-4bWDQb9Ag
// Bot1 = 1
// NotifyGroup = -1001518672052
// NotifyGroup2 = -1001743920551
// AdminChat = -1001667358664
// Admin = @VinciCash_S
// Chat = https://t.me/sniffer_chat
// Channel = https://t.me/ssniffer 


