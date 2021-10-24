const mongoose = require('mongoose');
const User = mongoose.model('User');

class UserRepository {
    constructor(){}

    async createUser (postData)  {
        let user = new User(postData);
        let result = await user.save();
        return result;
    }

    async findOneByQuery(query) {
        let result = await User.findOne(query);
        return result;
    }

    async findAllByQuery(query) {
        let result = await User.find(query);
        return result;
    }

    async getUserById  (id)  {
        console.log('id: ', id);
        let result = await User.findOne({_id: id});
        return result;
    }

    async getClientByEmail  (email)  {
        let result = await User.findOne({email: email});
        return result;
    }


    async updateUser(query, postBody) {
        let result = await User.updateOne(query, postBody, { new:true });
        return result;
    }
}

module.exports = UserRepository;





























