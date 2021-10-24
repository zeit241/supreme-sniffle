const tools = require('../server/tools')
const bot = require('../createBot')
const user = require('../database/models/userData')
const {Menu} = require('../objects')
module.exports =  async function isAuth(msg) {
    const condidate = await user.findOne({
        tg_id: msg.chat.id
    })
    if (condidate) {
        if (condidate.isAccepted == 'true') {
            bot.sendMessage(msg.chat.id, 'Добро пожаловать!', {
                reply_markup: {
                    keyboard: Menu,
                    resize_keyboard:true
                }
            })
        } else if (condidate.isAccepted == 'checking') {
            if (condidate.expirience == '-') {
                bot.sendMessage(msg.chat.id, 'Перед тем как ты сможешь получить доступ к боту, ответь пожалуйста не несколько вопросов\n(Ответы ни на что не влияют, они нужны для статистики)', {
                    reply_markup: {
                        keyboard: [
                            ['Написать админу']
                        ],
                        resize_keyboard: true
                    }
                })
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
            }
            if (condidate.from == '-') {
                bot.sendMessage(msg.chat.id, 'Перед тем как ты сможешь получить доступ к боту, ответь пожалуйста не несколько вопросов\n(Ответы ни на что не влияют, они нужны для статистики)', {
                    reply_markup: {
                        keyboard: [
                            ['Написать админу']
                        ],
                        resize_keyboard: true
                    }
                })
                bot.sendMessage(msg.chat.id, '2. Откуда узнали о нашем проекте', {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: "Реклама",
                                callback_data: "from_ad"
                            }, {
                                text: "От друзей",
                                callback_data: "from_friend"
                            }],
                            [{
                                text: "Другое",
                                callback_data: "from_other"
                            }]
                        ]
                    }
                })
            }
            if (condidate.from != '' && condidate.expirience != '') {
                bot.sendMessage(msg.chat.id, 'Ваша заявка еще рассматривется, мы постараемся обработать вашу заявку в ближайшее время.', {
                    reply_markup: {
                        keyboard: [
                            ['Написать админу']
                        ],
                        resize_keyboard: true
                    }
                })
            }
        } else if (condidate.isAccepted == 'false') {
            bot.sendMessage(msg.chat.id, 'К сожалению ваша заявка не прошла отбор, вы можете попробовать еще раз позже.', {
                reply_markup: {
                    keyboard: [
                        ['Написать админу']
                    ],
                    resize_keyboard: true
                }
            })
        }
    } else {
        await bot.sendMessage(msg.chat.id, '👮‍♀')
        bot.sendMessage(msg.chat.id, '<b>Добро пожаловать!</b>\nЧтобы получить доступ, подайте заявку👇🏻', {
            reply_markup: {
                keyboard: [
                    ["Подать заявку"],
                    ['Написать админу']
                ],
                resize_keyboard: true
            },
            parse_mode: 'HTML'
        })
        let ref_id = 0
        if (msg.text.split(' ')[1]) {
            let condidate = await user.findOne({
                tg_id: msg.text.split(' ')[1]
            })
            if (condidate) {
                ref_id = msg.text.split(' ')[1]
            }
        }
        new user({
            login: msg.chat.username || 'none',
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