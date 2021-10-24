const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const paymentSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    user_id: { type: String, required:true, index: true },
    card_id: { type: String, required:true, index: true },
    amount: {type: Number},
    payment_source: {type: String, default: null}, // stripe, braintree
    transaction_id: {type: String, default: null},
    invoice_id: {type: String, default: null},
    paid: {type: Boolean, default: false},
    status: {type: String, default: null},
    description: {type: String, default: false},
    added_dtm: { type: Date, default: Date.now, index: true },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('Payment', paymentSchema);