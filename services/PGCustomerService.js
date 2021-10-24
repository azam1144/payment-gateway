const config = require('../config');
const stripe = require("stripe")(config.stripe_keys.secrit_key);

class PGCustomerService{
    constructor(){ }

    async getMarchant(stripe_cust_id){
        return await stripe.customers.retrieve(
            stripe_cust_id,
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('createCard - err: ', err);
            return false;
        });
    }

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

    async updateMarchant( cust_id, updateData){
        return await stripe.customers.update(
            cust_id,
            updateData
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('updateMarchantCard - err: ', err);
            return false;
        });
    }

    async deleteMarchant( cust_id){
        return await stripe.customers.del(
            cust_id,
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('delete customer - err: ', err);
            return false;
        });
    }
}
module.exports = PGCustomerService