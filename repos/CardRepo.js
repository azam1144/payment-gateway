const mongoose = require('mongoose');
const Card = mongoose.model('Card');

class CardRepository {
    constructor(){
    }

    async createCard(postBody) {
        let card = new Card(postBody);
        let result = await card.save();
        return result;
    }

    async updateCard(query, postBody) {
        let result = await Card.updateOne(query, postBody, { new:true });
        return result;
    }

    async getByUserId(query) {
        let card = Card.findOne(query);
        return card;
    }

    async getCustomer(query) {
        let card = Card.findOne(query);
        return card;
    }
}

module.exports = CardRepository;





























