const config = require('../config');
const stripe = require("stripe")(config.stripe_keys.secrit_key);

class cardService{

    constructor(){

    }

    async createMarchantCard(cardInfo, customer){
        return await stripe.customers.createSource(
            customer.custId,
            {source: 'tok_visa'}
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('createCard - err: ', err);
            return err;
        });
    }
}
module.exports = cardService