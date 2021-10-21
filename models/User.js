const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    msisdn: { type: String, required:true, unique: true },
    username: String,
    fullname: String,
    email: String,
    added_dtm: { type: Date, default: Date.now, index: true },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('User', userSchema);