const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const userSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    name: { type: String, default: null},
    email: { type: String, default: null},
    password: { type: String, default: null},
    phone: { type: String, default: null},
    city: { type: String, default: null},
    country: { type: String, default: null},
    address: { type: String, default: null},
    added_dtm: { type: Date, default: Date.now, index: true },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('User', userSchema);