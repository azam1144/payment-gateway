const config = require('../config');
const stripe = require("stripe")(config.stripe_keys.secrit_key);

class paymentService{
    constructor(){ }

    async createMarchant(client){
        return stripe.customers.create({
            name: client.name,
            email: client.email,
            phone: client.phone,
        }).then(customer => {
            return customer;
        }).catch(function (err) {
            console.log('createCustomer - err: ', err);
            return false;
        });
    }

    async createCharge(amount, customer_id){
        return await stripe.charges.create({
            amount: amount * 100,
            currency: config.currency.usd,
            customer: customer_id,
            description: 'Some charge type',
        }).then(charge => {
            return charge;
        }).catch(function (err) {
            console.log('createCharge - err: ', err);
            return false;
        });

    }
}
module.exports = paymentService