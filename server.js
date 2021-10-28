require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./createBot')
require('./database/connectDb')()
require('./callbackResponse')
require('./eventHandler')
const app = express()

app.use(cors());
app.options('*', cors());
app.use(express.json({extended: true})) 
app.use('/api/', require('./server/routes/routes'))

app.listen(3000, ()=>{
  console.log('Сервер запущен')
})

// NTBA_FIX_319 = 1
// db = mongodb+srv://Admin:ern-sy6-7Ny-t5a@cluster0.x5zhz.mongodb.net/database?retryWrites=true&w=majority
// Bot = 2049069473:AAHir3pfuODtgD7thDmk9l9At-4bWDQb9Ag
// NotifyGroup = -1001740529423
// NotifyGroup2 = -1001740529423
// AdminChat = -1001740529423
// Admin = @VinciCash_S
// Chat = https://t.me/sniffer_chat
// Channel = https://t.me/ssniffer


