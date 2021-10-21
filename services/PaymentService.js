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
            return err;
        });
    }

    async createCharge(amount){
        console.log('createCharge - amount: ', amount);
        return await stripe.charges.create({
            amount: amount * 100,
            currency: 'usd',
            source: 'tok_visa',
            description: 'Appointment charges',
        }).then(charge => {
            return charge;
        }).catch(function (err) {
            console.log('createCharge - err: ', err);
            return err;
        });

    }
}
module.exports = paymentService