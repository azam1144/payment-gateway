const config = require('../config');
const stripe = require("stripe")(config.stripe_keys.secrit_key);

class cardService{

    constructor(){

    }

    async createMarchantCard(card_token, stripe_cust_id){
        return await stripe.customers.createSource(
            stripe_cust_id,
            {source: card_token}
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('createCard - err: ', err);
            return false;
        });
    }

    async updateMarchantCard( cust_id, card_id, updateData){
        return await stripe.customers.updateSource(
            cust_id,
            card_id,
            updateData
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('updateMarchantCard - err: ', err);
            return false;
        });
    }

    async deleteMarchantCard( cust_id, card_id){
        return await stripe.customers.deleteSource(
            cust_id,
            card_id,
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('createCard - err: ', err);
            return false;
        });
    }

    // set default to card
    async updateMarchantCardSetDefault( cust_id, card_id){
        return await stripe.customers.update(
            cust_id,
            {default_source: card_id}
        ).then(card => {
            return card;
        }).catch(function (err) {
            console.log('updateMarchantCard - err: ', err);
            return false;
        });
    }

    async createMarchantCardToken(cardInfo){
        return await stripe.tokens.create(
            {
                card: {
                    number: cardInfo.cus_card,
                    exp_month: cardInfo.card_exp_month,
                    exp_year: cardInfo.card_exp_year,
                    cvc: cardInfo.card_cvc,
                  },
            }
        ).then(token => {
            return token;
        }).catch(function (err) {
            console.log('createCardToken - err: ', err);
            return false;
        });
    }
}
module.exports = cardService