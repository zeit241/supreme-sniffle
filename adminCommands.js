const bot = require('./createBot')
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const promocode = require('./database/models/promo')
const {
    GetDateFormat,
    GetStringDate
} = require('./server/tools')
const {
    baseModelName
} = require('./database/models/account')
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
                    let transactions = user.transactions
                    transactions.push({type: 'Пополнение', value: '+'+msg.text.split(' ')[2], date: new Date()})
                    await data.updateOne({
                        tg_id: Number(msg.text.split(' ')[1])
                    }, {
                        balance: Number(user.balance) + Number(msg.text.split(' ')[2]),
                        transactions: transactions
                    }, {
                        upsert: true
                    }).then(async(e) => {
                        if (e) {
                            if(user.ref_id && user.ref_id!=0){
                                let x = await data.findOne({tg_id: user.ref_id})
                                await data.updateOne({
                                    tg_id: user.ref_id
                                },{ref_balance: Number(x.ref_balance||0) + ((Number(msg.text.split(' ')[2])*20)/100), transactions: [...x.transactions, {type: 'Реф. система', value: '+'+((Number(msg.text.split(' ')[2])*20)/100), date: new Date()}]}).then(e=>{
                                    bot.sendMessage(user.ref_id, `💸 Ваш Реферальный баланс был обновлен (${x.ref_balance||0}₽ → ${Number(x.ref_balance||0) + ((Number(msg.text.split(' ')[2])*20)/100)}₽)`)
                                })
                            }
                            bot.sendMessage(msg.chat.id, `💸 Баланс ${'@'+user.login||user.tg_id} успешно обновлен (${user.balance}₽ → ${user.balance+Number(msg.text.split(' ')[2])}₽)`)
                            bot.sendMessage(Number(msg.text.split(' ')[1]), `💸 Ваш баланс был обновлен (${user.balance}₽ → ${user.balance+Number(msg.text.split(' ')[2])}₽)`)
                        }
                    }).catch(err => {
                        console.error(err)
                        bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, '✅ Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/givebalnce <ID> <СУММА>')
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
                        vipType: '',
                        vipDate: new Date()
                    }, {
                        upsert: true
                    }).then((data) => {
                        if (data) {
                            bot.sendMessage(msg.text.split(' ')[1], `🤴🏻 Ваш статус VIP был обновлен.`)
                            bot.sendMessage(msg.chat.id, `✅ С пользователя ${'@'+user.login||user.tg_id} успешно снят VIP статус.`)
                        }
                    }).catch(err => {
                        bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, '❌ Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id,  '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/givebalnce <ID> <СУММА>')
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
                            bot.sendMessage(msg.chat.id, `✅ Пользователь ${'@'+user.login||user.tg_id} успешно удален.`)
                        }
                    }).catch(err => {
                        bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                    });
                } else {
                    bot.sendMessage(msg.chat.id, '❌ Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/clear <ID>')
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
                let querys = [],
                    type = ''
                msg.text.split(' ')[2].split(',').map(e => {
                    e = e.substr(1, e.length - 2).split('|')
                    type = e[1]
                    querys[e[0]] = {
                        name: e[2],
                        description: e[3].split('_').join(' '),
                        image: e[4],
                        redirect: e[5]
                    }
                })
                await new link({
                    link: msg.text.split(' ')[1],
                    type: type,
                    query: querys,
                }).save().then(() => {
                    bot.sendMessage(msg.chat.id, '✅ Ссылка успешно добавлена')
                })
            })
        } else {
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/clear <ID>')
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
                if (link) {
                    if (msg.text.split(' ')[2]) {
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
                                bot.sendMessage(msg.chat.id, `✅ Шаблон #${msg.text.split(' ')[2]} успешно удален`)
                            }
                        }).catch(err => {
                            bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                        });
                    } else {
                        await link.deleteOne({
                            link: msg.text.split(' ')[1]
                        }).then((data) => {
                            if (data) {
                                bot.sendMessage(msg.chat.id, `✅ Ссылка ${msg.text.split(' ')[1]} успешно удалена`)
                            }
                        }).catch(err => {
                            bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                        });
                    }
                } else {
                    bot.sendMessage(msg.chat.id, '❌ Такой ссылки не найдено')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/removelink <LINK>')
        }
    }
})
bot.onText(/\/getuserinfo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '') {
            await data.findOne({
                tg_id: Number(msg.text.split(' ')[1])
            }).then(async (user) => {
                let accounts = await account.find({
                    tg_id: Number(msg.text.split(' ')[1])
                })
                let users = await data.find({
                    ref_id: Number(msg.text.split(' ')[1])
                })
                if (user) {
                    bot.sendMessage(msg.chat.id, `👨🏻‍💻 Пользователь ${user.login}\n\n🆔 ID: ${user.tg_id}\n💰 Баланс: ${user.balance}\n🗣 Приглашен: ${user.ref_id==0?'-':user.ref_id}\n👨‍👩‍👧‍👧 Рефералов: ${users.length||0}\n👨‍👩‍👧‍👧 Реферальный баланс: ${user.ref_balance||0}\n👨‍👩‍👧‍👧 Количество аккаунтов: ${accounts.length||0}\n\n👑 VIP: ${user.vip?'✅':'🚫'}\n⏳ VIP закончится через: ${user.vip?GetStringDate(new Date(user.vipDate)):'🚫'}\n\n📆 Дата регистрации: ${GetDateFormat(user.reg_date)}`)
                } else {
                    bot.sendMessage(msg.chat.id, '❌ Пользователь с таким ID не найден')
                }
            })
        } else {
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/getuserinfo <ID>')
        }
    }
})
bot.onText(/\/sendall/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        let x = await bot.sendMessage(msg.chat.id, `✉️ Вы хотите отправить сообщение всем пользователям бота.\nДля этого в ответ на это сообщение отправте текст рассылки`)
        let y = bot.onReplyToMessage(x.chat.id, x.message_id, async function sendToAll(msg) {
            const users = await data.find()
            users.reverse()
            let c = 0,
                b = 0
            users.map(async user => {
                if (msg.photo) {
                    bot.sendPhoto(user.tg_id, msg.photo[msg.photo.length - 1].file_id, {
                        caption: msg.caption
                    })
                } else {
                    await bot.sendMessage(user.tg_id, msg.text).then((msg) => c++).catch(e => {
                        b++
                    })
                }
            })
            await bot.sendMessage(x.chat.id, `✅ Рассылка окончена`).then(it => bot.removeReplyListener(y))
        })
    }
})

bot.onText(/\/addpromo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] && msg.text.split(' ')[2] && msg.text.split(' ')[3]) {
            console.log(msg.text.split(' ')[1])
            let promo = await promocode.findOne({
                promo: msg.text.split(' ')[1]
            })
            if(!promo){
                await new promocode({
                    type: 'balance',
                    promo: msg.text.split(' ')[1],
                    value: msg.text.split(' ')[2],
                    mactivation: Number(msg.text.split(' ')[3])
                }).save().then((data) => {
                    if (data) {
                        bot.sendMessage(msg.chat.id, `✅ Промокод <code>${msg.text.split(' ')[1]}</code> успешно добавлен.`,{
                            parse_mode: 'HTML'
                        })
                    }
                }).catch(err => {
                    bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                })
            }else{
                bot.sendMessage(msg.chat.id, '❌ Такой промокод уже существет.')
            }
        }else{
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/addpromo <PROMO> <VALUE> <MAX ACTIVATIONS>')
        }
    }
})
bot.onText(/\/promoinfo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] !== '') {
            let promo = await promocode.findOne({
                promo: msg.text.split(' ')[1]
            })
            if(promo){
                let used = ''
                if(promo.activations>0){
                    promo.usedBy.map((e,i)=>{
                        used += `#${i+1}\nИспользовал: @${e.login}\nID: <code>${e.tg_id}</code>\nДата: <code>${GetDateFormat(e.date)}</code>\n\n`
                    })
                }else{
                    used = 'Промокод еще никто не использовал.'
                }
                bot.sendMessage(msg.chat.id, `🎟 Промокод <code>${promo.promo}</code>\n\nИспользовано: ${promo.activations}/${promo.mactivation}\n\n${used}`,{
                    parse_mode: 'HTML'
                })
            }else{
                bot.sendMessage(msg.chat.id, '❌ Такой промокод не существет.')
            }
        }else{
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/promoinfo <PROMO>')
        } 
    }
})
bot.onText(/\/allpromoinfo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        let promo = await promocode.find()
        if(promo.length>0){
            let str = 'Промокоды\n\n'
            promo.map((e,i)=>{
                str+=`Промокод #${i+1} <code>${e.promo}</code> Использовано: ${e.activations}/${e.mactivation}\n`
            })
            bot.sendMessage(msg.chat.id, str,{
                parse_mode: 'HTML'
            })
        }else{
            bot.sendMessage(msg.chat.id, '❌ Промокодов нет')
        } 
    }
})

bot.onText(/\/addvippromo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1] && msg.text.split(' ')[2] && msg.text.split(' ')[3]) {
            console.log(msg.text.split(' ')[1])
            let promo = await promocode.findOne({
                promo: msg.text.split(' ')[1]
            })
            if(!promo){
                await new promocode({
                    type: 'vip',
                    promo: msg.text.split(' ')[1],
                    value: msg.text.split(' ')[2],
                    mactivation: Number(msg.text.split(' ')[3])
                }).save().then((data) => {
                    if (data) {
                        bot.sendMessage(msg.chat.id, `✅ Промокод <code>${msg.text.split(' ')[1]}</code> успешно добавлен.`,{
                            parse_mode: 'HTML'
                        })
                    }
                }).catch(err => {
                    bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                })
            }else{
                bot.sendMessage(msg.chat.id, '❌ Такой промокод уже существет.')
            }
        }else{
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/addpromo <PROMO> <VALUE> <MAX ACTIVATIONS>')
        }
    }
})
bot.onText(/\/removepromo/, async (msg) => {
    const user = await data.findOne({
        tg_id: msg.from.id
    })
    if (user.isAdmin) {
        if (msg.text.split(' ')[1]) {
            let promo = await promocode.findOne({
                promo: msg.text.split(' ')[1]
            })
            if(promo){
                await promocode.deleteOne({
                    promo: msg.text.split(' ')[1],
                }).then((data) => {
                    if (data) {
                        bot.sendMessage(msg.chat.id, `✅ Промокод <code>${msg.text.split(' ')[1]}</code> успешно удален.`,{
                            parse_mode: 'HTML'
                        })
                    }
                }).catch(err => {
                    bot.sendMessage(msg.chat.id, '❌ Что-то пошло не так 😥, попробуйте позже')
                })
            }else{
                bot.sendMessage(msg.chat.id, '❌ Такой промокод уже существет.')
            }
        }else{
            bot.sendMessage(msg.chat.id, '❌ Неверный синтаксис, пожалуйста введите команду в виде\n/removepromo <PROMO> ')
        }
    }
})
// /ban
// /unban
// /sendto
// /setrefbalance
// /setpinmessage