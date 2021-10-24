const bot = require('./createBot')
const data = require('./database/models/userData')
const account = require('./database/models/account')
const link = require('./database/models/link')
const {GetDateFormat,GetStringDate} = require('./server/tools')
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
                        bot.sendMessage(msg.chat.id, `👨🏻‍💻 Пользователь ${user.login}\n\n🆔 ID: ${user.tg_id}\n💰 Баланс: ${user.balance}\n👨‍👩‍👧‍👧 Рефералов: ${users.length||0}\n👨‍👩‍👧‍👧 Реферальный баланс: ${user.ref_balance||0}\n👨‍👩‍👧‍👧 Количество аккаунтов: ${accounts.length||0}\n\n👑 VIP: ${user.vip?'✅':'🚫'}\n⏳ VIP закончится через: ${user.vip?GetStringDate(new Date(user.vipDate)):'🚫'}\n\n📆 Дата регистрации: ${GetDateFormat(user.reg_date)}`)
                    } else {
                        bot.sendMessage(msg.chat.id, 'Пользователь с таким ID не найден')
                    }
                })
            } else {
                bot.sendMessage(msg.chat.id, 'Неверный синтаксис, пожалуйста введите команду в виде\n/getuserinfo <userID>')
            }
        }
    })
    bot.onText(/\/sendall/, async (msg) => {
        const user = await data.findOne({
            tg_id: msg.from.id
        })
        if (user.isAdmin) {
            let x = await bot.sendMessage(msg.chat.id, `Вы хотите отправить сообщение всем пользователям бота.\nДля этого в ответ на это сообщение отправте текст рассылки`)
            bot.onReplyToMessage(x.chat.id, x.message_id, async function sendToAll(msg){
                const users = await data.find()
                users.reverse()
                let c = 0, b = 0
                users.map(async user => {
                    if(msg.photo){           
                        bot.sendPhoto(user.tg_id, msg.photo[msg.photo.length-1].file_id, {
                            caption: msg.caption
                        })
                    }else{
                        await bot.sendMessage(user.tg_id, msg.text).then((msg) => c++).catch(e=>{b++})
                    }
                })
                await bot.sendMessage(x.chat.id, `Рассылка окончена`)
            })
        }
    })