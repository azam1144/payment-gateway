const mongoose = require('mongoose');
const ShortId = require('mongoose-shortid-nodeps');
const {Schema} = mongoose;

const cardSchema = new Schema({
    _id: { type: ShortId, len: 12, retries: 4 },
    name: { type: String, default: undefined, index: true },
    user_id: { type: String, default: undefined, index: true },
    payment_gateway_cust_id: { type: String, default: undefined, index: true}, // for example, customer ID at Stripe
    payment_gateway_card_id: { type: String, default: undefined, index: true}, // for example, customer's card ID at stripe
    payment_gateway_source_type: { type: String, default: undefined}, // for example, stripe, braintree, paypal
    address_city: { type: String, default: undefined}, 
    address_state: { type: String, default: undefined}, 
    address_country: { type: String, default: undefined}, 
    address_zip: { type: String, default: undefined}, 
    address_line1: { type: String, default: undefined}, 
    default_card: { type: Boolean, default: false}, 
    added_dtm: { type: Date, default: Date.now },
    last_modified: Date,
    active: { type: Boolean, default: true, index: true }
}, { strict: true });

module.exports = mongoose.model('Card', cardSchema);