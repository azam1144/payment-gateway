
const mongoose = require('mongoose');
const AuthToken = mongoose.model('AuthToken');

class AuthRepository {
    constructor(){
    }

    async createOrUpdate(postData) {
        let existingToken = await this.getByEmail(postData.email);
        if(existingToken){
            this.update(postData.email, postData.auth_token);
            return;
        }
        
        let token = new AuthToken(postData);
        await token.save();
    }

    async update(email, auth_token) {
        return await AuthToken.updateOne({email: email}, {$set: {auth_token: auth_token}});
    }

    async getByEmail(email) {
        return await AuthToken.findOne({email: email});
    }

    async getByAuthToken(token) {
        return await AuthToken.findOne({auth_token: token});
    }
}

module.exports = AuthRepository;