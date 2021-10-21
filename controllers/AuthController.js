const jwt = require("jsonwebtoken");
const config = require("../config");

const container = require("../configurations/container");
const authRepo = container.resolve("authRepository");
const userRepo = container.resolve("userRepository");
const authMiddleWare = require('../middleware/auth');

refresh = async (req, res) => {

    const refreshToken = req.body.token;
    if (refreshToken == null) {
        return res.send({code: 401, message: 'Un-Authorized'});
    }

    let token = await authRepo.getByAuthToken(refreshToken);
    if (!token || token === null || (token && token === 'null')) {
        return res.send({code: 403, message: 'Forbidden'});
    }

    jwt.verify(refreshToken, config.tokens.access_token_secret, async(err, decodedClient) => {
        if (err) {
            console.log(err);
            return res.send({code: 403, message: 'Forbidden'});
        }
        const at = await generateAccessToken(decodedClient.client);
        const rt = await generateRefreshToken(decodedClient.client);
        authRepo.createOrUpdate({email: req.body.email, auth_token: at});

        res.json({
            access_token: at,
            refresh_token: rt
        });
    });
}

token = async (req, res) => {
    if (req.body.email){
        let record = await userRepo.getClientByEmail(req.body.email);
        if (!record){
            res.send({code: config.code_error, message: "User not exist"});
            return;
        }

        const accessToken = await generateAccessToken(record);
        const refreshToken = await generateRefreshToken(record);
        authRepo.createOrUpdate({email: req.body.email, auth_token: accessToken});

        res.send({access_token: accessToken, refresh_token: refreshToken});
    }
    else
        res.send({code: config.code_error, message: "Please enter email address"});
}


generateAccessToken = async(client) => {
    return await authMiddleWare.generateAccessToken(client);
}

generateRefreshToken = async(client) => {
    return await authMiddleWare.getRefreshToken(client);
}


module.exports = {
    generateRefreshToken: generateRefreshToken,
    generateAccessToken: generateAccessToken,
    refresh: refresh,
    token: token,
    deleteToken: deleteToken
}