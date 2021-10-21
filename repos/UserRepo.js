const mongoose = require('mongoose');
const User = mongoose.model('User');

class UserRepository {
    constructor({subscriptionRepository}){
        this.subscriptionRepo = subscriptionRepository;
    }

    async createUser (postData)  {
        let user = new User(postData);
        let result = await user.save();
        return result;
    }

    async getUserById  (id)  {
        let result = await User.findOne({_id: id});
        return result;
    }

    async getActiveUsers (from, to)  {
        const result = await User.find({operator:"telenor", $and:[{added_dtm:{$gte:new Date(from)}}, {added_dtm:{$lte:new Date(to)}}]}, {msisdn:1});
        return result;
    }
}

module.exports = UserRepository;





























