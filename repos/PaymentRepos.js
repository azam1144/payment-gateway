const mongoose = require('mongoose');
const Payment = mongoose.model('Payment');

class PaymentRepos{
    constructor(){

    }

    async createBilling(postBody) {
        let payment = new Payment(postBody);
        let result = await payment.save();
        return result;
    }
}

module.exports = PaymentRepos;
