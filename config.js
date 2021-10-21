const env = process.env.NODE_ENV || 'development';

const codes = {
    code_error: -1,
    code_success: 0,
    code_record_added: 1,
    code_record_updated: 2,
    code_record_deleted: 3,
}

const base_path = 'http://localhost:3010';
const dbname = "aladdindbd";
let config = {
    development: {
        port: 3011,
        codes: codes,
        base_path: base_path,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    },
    staging: {
        port: 3011,
        base_path: base_path,
        codes: codes,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    },
    production: {
        port: 3011,
        base_path: base_path,
        codes: codes,
        mongoDB: `mongodb://localhost:27017/${dbname}`
    }
};

console.log("---", env);

if (env === 'development') config = config.development;
if (env === 'staging') config = config.staging;
if (env === 'production') config = config.production;

module.exports = config;
