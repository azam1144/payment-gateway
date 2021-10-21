const jwt = require('jsonwebtoken');
const config = require('../config.js');

authorization = async (req, res) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if(token === null || token === undefined){
        res.send({code: 401, message: "Un Authorized. Please Sign In"});
        return false;
    }

    let jwtValidation = await jwt.verify(token, config.jwt_tokens.access_token_secret, async (err, decodedClient) => {
        if(err){
            if (err.hasOwnProperty('name')){
                if (err.name === 'TokenExpiredError'){
                    res.send({code: 403, message: "Token Expired. Please Sign In"});
                    return false;
                }
            }
            res.send({code: 403, message: "Forbidden. Please Sign In"});
            return false;
        }
        else{
            req.client = decodedClient.client;
        }
    });

    return jwtValidation;
}


generateAccessToken = (client) => {
  const accessToken = jwt.sign({client: client}, config.jwt_tokens.access_token_secret, {expiresIn: '3h'});
  return accessToken;
}

getRefreshToken = (client) => {
  const token = jwt.sign({client: client}, config.jwt_tokens.access_token_secret);
  return token;
}

module.exports = {
    authorization: authorization,
    generateAccessToken: generateAccessToken,
    getRefreshToken: getRefreshToken
}