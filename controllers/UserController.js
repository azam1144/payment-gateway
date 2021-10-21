const container = require("../configurations/container");
const userRepo = container.resolve('userRepository');
const authRepo = container.resolve('authRepository');

const config = require('../config');
const authController = require('./AuthController');

exports.login = async (req, res) => {
	let {email, password} = req.body;

	if(email && password){
		let record = await userRepo.get(email, password);
		if(record){
			let accessToken = await authController.generateAccessToken(record);
			let refreshToken = await authController.generateRefreshToken(record);
			authRepo.createOrUpdate({email: email, auth_token: accessToken});

			res.send({
				code: config.codes.code_success,
				data: record,
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		}else{
			res.send({code: config.codes.code_error, 'message': 'This account is not exist. Please Sign Up'});
		}
	}else{
		res.send({code: config.codes.code_success, 'message': 'Email/Password not provided'});
	}
}

// CREATE
exports.post = async (req, res) => {
	let postData = req.body;

	// checking if there's already any client exist
	let record = await userRepo.getClientByEmail(postData.email);
	if(record){
		res.send({code: config.codes.code_error, 'message': 'This email is already exists'});
	}else{
		// Saving document
		let result = await userRepo.create(postData);
		res.send({code: config.codes.code_success, data: result});
	}
}

// GET
exports.get = async (req, res) => {

    let client = await userRepo.findAllByQuery({});
    res.send({code: config.codes.code_success, data: client});
}

// GET BY ID
exports.getById = async (req, res) => {
	let { id } = req.params;
	if (id) {
		let client = userRepo.findOneByQuery({_id: id});
		res.send(client);
	}
	else{
		res.send({code: -1, message: 'No id provided'});
	}
}

// GET BY EMAIL
exports.getByEmail = async (req, res) => {
	let { email } = req.params;
	if (email) {
		let client = userRepo.findOneByQuery({email: email});
		res.send(client);
	}
	else{
		res.send({code: -1, message: 'No email provided'});
	}
}

// UPDATE
exports.put = async (req, res) => {
	let query = { _id: req.query._id };

	let postBody = req.body;
	postBody.last_modified = new Date();

	const result = await userRepo.update(query, postBody);
	if (result.nModified == 0) {
		console.log('User not found!');
		res.send({code: config.codes.code_error, message: "No user found with this id"});
	}
	else {
		console.log(`User is Updated!`);
		res.send({code: config.codes.code_success, message: "Success"});
	}
}

// DELETE
exports.delete = async (req, res) => {
	let query = { _id: req.query._id };
	const result = await clientRepo.delete(query);
	if (!result) {
		console.log('User not found!');
		res.send({code: config.codes.code_error, message: "User not found with this id"});
	}
	else {
		console.log(`User ID: ${query._id} deleted!`);
		res.send({code: config.codes.code_success, message: "Success"});
	}
}
