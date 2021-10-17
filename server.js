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
// async function addNewLink(){
//   const Link = await new link({
//     link: 'http://localhost:3000',
//     name: 'Name #1',
//     description: 'Some description  Some description Some description Some description',
//     image: 'http://localhost:3000-',
//     redirect: 'http://localhost:3000',
//   }).save()
// }
// addNewLink()

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