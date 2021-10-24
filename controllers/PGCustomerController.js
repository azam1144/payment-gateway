const container = require("../configurations/container");
const pGCutomerRepo = container.resolve('pGCutomerRepository');

const PGCustomerService = require("../services/PGCustomerService");
const pGCustomerService = new PGCustomerService();

const config = require('../config');

// GET
exports.get = async (req, res) => {
	let query = {};

	if(req.query._id) query._id = req.query._id;
	if(req.query.source) query.source = req.query.source;
	if(req.query.user_id) query.user_id = req.query.user_id;
	if(req.query.source_customer_id) query.source_customer_id = req.query.source_customer_id;

	let paymentGatewayCust = await pGCutomerRepo.findAllByQuery(query);

    res.send({code: config.codes.code_success, data: paymentGatewayCust});
}

// CREATE
exports.post = async (req, res) => {

	try{
		let postBody = req.body;

		let pGCutomer = await pGCustomerService.createMarchant(postBody);
		console.log('pGCutomer: ', pGCutomer);

		if (pGCutomer){
			// create a new customer at payment gateway
			let bodyData = {};
			bodyData.source = postBody.source;
			bodyData.source_customer_id = pGCutomer.id;
			bodyData.user_id = postBody.user_id;

			let newPGCutomer = await pGCutomerRepo.createPGCustomer(bodyData);
			console.log('newPGCutomer: ', newPGCutomer);

			// Add new user's card in DB
			if (newPGCutomer){
				res.send({code: config.codes.code_success, data: newPGCutomer});
			}
			else{
				console.log("Customer creation process at target PG is done successfully but there are some problems at DB insert operation!");
				res.send({code: config.codes.code_error, message: "Customer creation process at target PG is done successfully but there are some problems at DB insert operation!"});
			}
		}
		else{
			console.log("Could not successfully done at targeted payment gateway.");
			res.send({code: config.codes.code_error, message: "Could not successfully done at targeted payment gateway."});
		}

	}catch(error){
		console.log('Some exceptions accured! Please contact the support team');
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	}
}

// UPDATE
exports.put = async (req, res) => {
	try{
		let query = { _id: req.query._id };

		let postBody = req.body;
		postBody.last_modified = new Date();

		let updateData = {};
		if(postBody.name) updateData.name = postBody.name;
		if(postBody.phone) updateData.phone = postBody.phone;
		if(postBody.email) updateData.email = postBody.email;

		let pgCustomer = await pGCutomerRepo.findOneByQuery(query);
		if(pgCustomer){

			let pgCustomerUpdate = await pGCustomerService.updateMarchant(pgCustomer.source_customer_id, updateData);
			if(pgCustomerUpdate){

				let result = await pGCutomerRepo.updatePGCustomer(query, postBody);
				if (result.nModified == 0) {
					console.log('PG Customer not found!');
					res.send({code: config.codes.code_error, message: "PG Customer not found!"});
				}
				else {
					console.log(`PG Customer is Updated!`);
					res.send({code: config.codes.code_success, message: "Success!"});
				}
			}
			else {
				console.log(`Payment gateway, Card could not updated!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, CarPG Customert could not updated! Please validate your form input."});
			}
		}
		else{
			console.log("PGCustomer could not foun in Database!");
		}
		
	}catch(error){
		console.log(`Some exceptions accured!`);
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	}
}

// DELETE
exports.delete = async (req, res) => {
	try{
		let query = { _id: req.query._id };
		let pgCustomer = await pGCutomerRepo.findOneByQuery({_id: req.query._id});
		console.log("pgCustomer: ", pgCustomer);
		if (pgCustomer){
			let pgCustomerDelete = await pGCustomerService.deleteMarchant(pgCustomer.source_customer_id);
				console.log("pgCustomerDelete: ", pgCustomerDelete);

			if(pgCustomerDelete.deleted){
				let result = await pGCutomerRepo.delete(query);
				console.log("result: ", result);

				if (!result) {
					console.log('Customer not found!');
					res.send({code: config.codes.code_error, message: "Customer not found with this id"});
				}
				else {
					console.log(`Customer : ${query._id} deleted!`);
					res.send({code: config.codes.code_success, message: "Success"});
				}
			}
			else{
				console.log(`Payment gateway, customer could not deleted!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, Customer could not deleted! Please validate your input."});
			}
		}
		else {
			console.log(`Payment gateway, Customer not found!`);
			res.send({code: config.codes.code_error, message: "Payment gateway, Customer not found!"});
		}
	}catch(error){
		console.log(`Some exceptions accured!`);
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	};
}
