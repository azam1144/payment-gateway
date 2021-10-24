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
        let result = await Card.updateOne(query, postBody, { upsert: true });
        return result;
    }

    async updateAllCard(query, postBody) {
        let result = await Card.updateMany(query, postBody);
        return result;
    }

    async get(query) {
        return Card.find(query);
    }

    async getOneByQuery(query) {
        let card = Card.findOne(query);
        return card;
    }

    async delete(query) {
        let card = Card.findOneAndRemove(query);
        return card;
    }
}

module.exports = CardRepository;





























