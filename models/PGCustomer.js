const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const pgCustomerSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    source: { type: String, index: true, default: undefined}, // Stripe, braintree, paypal
    source_customer_id: { type: String, index: true, default: undefined}, // for example, stripe customer ID
    user_id: { type: String, index: true, default: undefined},
    added_dtm: { type: Date, default: Date.now, index: true },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('PGCustomer', pgCustomerSchema);