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

