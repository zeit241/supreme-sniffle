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
const links = {
    'vk': 'https://vk.com/',
    'inst': 'https://www.instagram.com/',
    'ok': 'https://ok.ru/profile/',
    'fb': 'https://ru-ru.facebook.com/profile.php?id=',
}
const vip = {
    1:{
        name: '⛏ Рабочий',
        description: '🧑🏼‍💻 Подходит для Воркеров',
        price: 50,
        duration: 7,
        list: [
            '👑 Вам выдается VIP на 7 дней!',
            '',
            '✅ Доступна вкладка "🔗 Мои ссылки"',
            '✅ Доступен приход аккаунтов по ссылкам',
            '✅ Вам доступны все фейки',          
            '✅ Вам доступен общий домен',
            '❌ Вам доступен сменный домен',
            '❌ Видоизменение ссылок',
            '❌ Вам доступен чат VIP',
            '❌ Уведомления о новом аккаунте',
            '❌ Проверка валидности данных',
            '❌ Связь с Администрацией 24/7!',
            '❌ Проверка на повторяющиеся аккаунты',
            '❌ Заказ личного фейка',    
            '❌ Ваши аккаунты видны "Предпринимателям"',
            '',
            '❌ Дополнения',
            '            Выгода: 0₽',
            '            Репутация: 0SP',
            '',
            '❌ Администрация не советует данный VIP Статус!',
        ]
    },
    2:{
        name: '🤴🏻 Любитель',
        description: '💻 Подходит для любителей поработать на себя',
        price: 300,
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
            '✅ Уведомления о новом аккаунте',          
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',
            '',
            '✅ Дополнения',
            '            Выгода: 0₽',
            '            Репутация: +100SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    },
    3:{
        name: '🥷🏻 Профи',
        description: '💻 Подходит для любителей поработать на себя',
        price: 500,
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
        name: '👀 Предприниматель',
        description: 'Подходит для продавцов',
        price: 2500,
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
            '✅ Уведомления о новом аккаунте',                
            '✅ Проверка валидности данных',
            '✅ Связь с Администрацией 24/7!',
            '✅ Проверка на повторяющиеся аккаунты',
            '✅ Заказ личного фейка',    
            '✅ Ваши аккаунты видны только вам!',
            '👀 Просмотр аккаунтов "⛏ Рабочих"',          
            '',
            '✅ Дополнения',
            '            Выгода: 50₽',
            '            Репутация: +500SP',
            '',
            '✅ Администрация советует данный VIP Статус!',
        ]
    }
}
const emptyString = '                                                                                           '
const Menu = [
    ['👤 Мой профиль', '🔗 Мои ссылки'],
    ['👥 Мои аккаунты', '👑 VIP Статус'],
    ['💸 Пополнение', '🎁 Получить бонус'],
    ['👨‍👩‍👧‍👦 Мои рефералы', '🎟 Промо-Коды'],
    ['❓ Информация', '👥 Наш чат'],
    ['⚡️ Новости', '📊 О боте']
]
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
]
module.exports = {names, links, emptyString, ReplayListAccs, ReplayListLinks ,vip,Menu}