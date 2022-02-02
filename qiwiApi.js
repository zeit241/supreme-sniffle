const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
module.exports = new QiwiBillPaymentsAPI(process.env.QIWI_API_TOKEN);