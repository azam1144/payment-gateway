const mongoose = require('mongoose');
const PGCustomer = mongoose.model('PGCustomer');

class pGCutomerRepository {
    constructor(){}

    async createPGCustomer (postData)  {
        let pGCustomer = new PGCustomer(postData);
        return await pGCustomer.save();
    }

    async findOneByQuery(query) {
        let result = await PGCustomer.findOne(query);
        return result;
    }

    async findAllByQuery(query) {
        let result = await PGCustomer.find(query);
        return result;
    }

    async getPGCustomerById  (id)  {
        let result = await PGCustomer.findOne({_id: id});
        return result;
    }

    async updatePGCustomer(query, postBody) {
        let result = await PGCustomer.updateOne(query, postBody, { upsert: true });
        return result;
    }

    async delete(query) {
        let result = PGCustomer.findOneAndRemove(query, {useFindAndModify: true});
        return result;
    }
}

module.exports = pGCutomerRepository;





























