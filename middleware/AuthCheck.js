const tools = require('../server/tools')
const bot  = require('../createBot')
const user = require('../database/models/userData')

async function isAuth(msg) {
    const condidate = await user.findOne({
        tg_id: msg.chat.id
    })
    if (condidate) {
        if (condidate.isAccepted == 'true') {
            tools.CreateNewMessageWithKeyboard(msg.chat.id, 'Добро пожаловать!', [
                ['👤 Мой профиль', '🔗 Мои ссылки'],
                ['👥 Мои аккаунты', '👑 VIP Статус'],
                ['❓ Информация', '👥 Наш чат'],
                ['⚡️ Новости', '📊 О боте']
            ])
        } else if (condidate.isAccepted == 'checking') {
            if (condidate.expirience == '-') {
                tools.CreateNewMessageWithKeyboard(msg.chat.id, 'Перед тем как ты сможешь получить доступ к боту, ответь пожалуйста не несколько вопросов\n(Ответы ни на что не влияют, они нужны для статистики)', [
                    ['Написать админу']
                ])
            }
            if (condidate.from == '-') {
                return true
            }
            if (condidate.from != '' && condidate.expirience != '') {
                tools.CreateNewMessageWithKeyboard(msg.chat.id, 'Ваша заявка еще рассматривется, мы постараемся обработать вашу заявку в ближайшее время.', [
                    ['Написать админу']
                ])
            }
        } else if (condidate.isAccepted == 'false') {
            tools.CreateNewMessageWithKeyboard(msg.chat.id, 'К сожалению ваша заявка не прошла отбор, вы можете попробовать еще раз позже.', [
                ['Написать админу']
            ])
        }
    } else {
        await bot.sendMessage(msg.chat.id, '👮‍♀')
        tools.CreateNewMessageWithKeyboard(msg.chat.id, '<b>Добро пожаловать!</b>\nЧтобы получить доступ, подайте заявку👇🏻', [
            ["Подать заявку"],
            ['Написать админу']
        ])
        let ref_id = 0
        if (msg.text.split(' ')[1]) {
            let condidate = await user.findOne({
                tg_id: msg.text.split(' ')[1]
            })
            if (condidate) {
                ref_id = msg.text.split(' ')[1]
            }
        }
        const NewUser = new user({
            login: msg.chat.username,
            name: msg.chat.first_name,
            expirience: '-',
            from: '-',
            ban: false,
            tg_id: msg.chat.id,
            reg_date: new Date(),
            ref_id: ref_id,
            balance: 0,
            vip: false,
            isAdmin: false,
        }).save()
    }
}

module.exports = isAuth