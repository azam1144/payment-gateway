const mongoose = require('mongoose');
const BillingHistory = mongoose.model('BillingHistory');

class paymentRepos{
    constructor(){

    }

    async createBilling(postBody) {
        let billing = new BillingHistory(postBody);
        let result = await billing.save();
        return result;
    }
}

module.exports = paymentRepos;
