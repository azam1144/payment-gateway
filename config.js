const env = process.env.NODE_ENV || 'development';

const codes = {
    code_error: -1,
    code_success: 0,
    code_record_added: 1,
    code_record_updated: 2,
    code_record_deleted: 3,
}

const currency = {
    usd: 'usd',
    aed: 'aed',
    pk: 'pk'
}

const stripe_keys = {
    public_key: 'pk_test_51Id9KNCCIKokJJRc31wwOHP2Nj4Ms9eWEL3IviZvThUL7as2tkZ9XSPOUtc4xXjGtARfE4SfdtH0QdskKlBQKhJj003CDVnPm1',
    secrit_key: 'sk_test_51Id9KNCCIKokJJRcJihqJmmjEgkaFC2NQa5jBGGP208qNSy5VdEFYgSpNHV3hs7NiPwAqgMNdkCHdR529GFy0gFi00LZ2Y8YXH'
}

const jwt_tokens = {
    access_token_secret: "AATx7RYL39bJhLSCIK2aouwVT6oGBIODylc2jrmN3gHPgC6VHN1vL5Z9lt78",
    refresh_token_secret: "2YJ5DK26flgLt2EkEgW70YnIiHBnlg4FBtkNCFVzChVpNY1fZPJtcxPLa9Qj" 
}


const base_path = 'http://localhost:3010';
const dbname = "aladdindbd";
let config = {
    development: {
        port: 3011,
        codes: codes,
        currency: currency,
        base_path: base_path,
        jwt_tokens: jwt_tokens,
        stripe_keys: stripe_keys,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    },
    staging: {
        port: 3011,
        codes: codes,
        currency: currency,
        base_path: base_path,
        jwt_tokens: jwt_tokens,
        stripe_keys: stripe_keys,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    },
    production: {
        port: 3011,
        codes: codes,
        currency: currency,
        base_path: base_path,
        jwt_tokens: jwt_tokens,
        stripe_keys: stripe_keys,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
