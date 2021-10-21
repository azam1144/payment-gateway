const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const cardSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    user_id: { type: String, required:true, unique: true },
    card_type: String, // card or manual
    card_source: String, // stripe, braintree
    added_dtm: { type: Date, default: Date.now, index: true },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('Card', cardSchema);