const container = require("../configurations/container");
const cardRepo = container.resolve('cardRepository');
const pGCutomerRepo = container.resolve('pGCutomerRepository');

const CardService = require("../services/CardService");
const cardService = new CardService();

const config = require('../config');
const PGCustomerService = require("../services/PGCustomerService");
const pGCustomerService = new PGCustomerService()
// GET
exports.get = async (req, res) => {
	let query = {}, cards;

	if(req.query._id) query._id = req.query._id;
	if(req.query.user_id) query.user_id = req.query.user_id;
	if(req.query.payment_gateway_cust_id) query.payment_gateway_cust_id = req.query.payment_gateway_cust_id;

	cards = await cardRepo.get(query);

    res.send({code: config.codes.code_success, data: cards});
}

// CREATE
exports.post = async (req, res) => {

	try{
		let postBody = req.body;

		let card_token = null;
		if(postBody.cardToken){
			card_token = postBody.cardToken;
		}
		else{
			// Generate a token by card information
			let postData = {};
			if(!postBody.cus_card && !postBody.cus_exp_month && !postBody.cus_exp_year && !postBody.cus_cvc){
				console.log("Missing form data");
				res.send({code: config.codes.code_error, message: "Please input all form feilds."});
				return;
			}
			else{
				postData.cus_card = postBody.cus_card;
				postData.card_exp_month = postBody.card_exp_month;
				postData.card_exp_year = postBody.card_exp_year;
				postData.card_cvc = postBody.card_cvc;

				card_token = await cardService.createMarchantCardToken(postData);
				card_token = card_token.id;
			}
		}

		let pGCutomer = await pGCutomerRepo.findOneByQuery({user_id: postBody.user_id});
		if (pGCutomer){
			// create a new card for this customer
			let newCard = await cardService.createMarchantCard(card_token, pGCutomer.source_customer_id);

			// Add new user's card in DB
			if (newCard){
		
				postBody.user_id = postBody.user_id;
				postBody.payment_gateway_card_id = newCard.id;
				postBody.payment_gateway_cust_id = pGCutomer.source_customer_id;
				postBody.payment_gateway_source_type = postBody.source;
		
				let card = await cardRepo.getOneByQuery({user_id: postBody.user_id, active: true, default_card: true});
				if(!card){
					postBody.default_card = true;
				}

				let result = await cardRepo.createCard(postBody);
				res.send({code: config.codes.code_success, data: result});
			}
			else{
				console.log("User card could not created successfully!");
				res.send({code: config.codes.code_error, message: "Some problems accured durring creating card!"});
			}
		}
		else{
			console.log("User not found at targeted payment gateway");
			res.send({code: config.codes.code_error, message: "User not found at targeted payment gateway! Please created customer first."});
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
		if(postBody.card_exp_month) updateData.exp_month = postBody.card_exp_month;
		if(postBody.card_exp_year) updateData.exp_year = postBody.card_exp_year;
		if(postBody.address_city) updateData.address_city = postBody.address_city;
		if(postBody.address_state) updateData.address_state = postBody.address_state;
		if(postBody.address_country) updateData.address_country = postBody.address_country;
		if(postBody.address_zip) updateData.address_zip = postBody.address_zip;
		if(postBody.address_line1) updateData.address_line1 = postBody.address_line1;


		let card = await cardRepo.getOneByQuery({_id: req.query._id});
		if (card){
			let cardUpdate = await cardService.updateMarchantCard(card.payment_gateway_cust_id, card.payment_gateway_card_id, updateData);
			if(cardUpdate){
				postBody.payment_gateway_card_id = cardUpdate.id;
				let result = await cardRepo.updateCard(query, postBody);
				if (result.nModified == 0) {
					console.log('Card not found!');
					res.send({code: config.codes.code_error, message: "Card not found!"});
				}
				else {
					console.log(`Card is Updated!`);
					res.send({code: config.codes.code_success, message: "Success!"});
				}
			}
			else {
				console.log(`Payment gateway, Card could not updated!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, Cart coul not updated! Please validate your form input."});
			}
		}
		else {
			console.log(`Payment gateway, card not found!`);
			res.send({code: config.codes.code_error, message: "Payment gateway, card not found!"});
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
		let card = await cardRepo.getOneByQuery({_id: req.query._id});
		if (card){
			let cardDelete = await cardService.deleteMarchantCard(card.payment_gateway_cust_id, card.payment_gateway_card_id);

			if(cardDelete.deleted){
				let result = await cardRepo.delete(query);
				if (!result) {
					console.log('Card not found!');
					res.send({code: config.codes.code_error, message: "Card not found with this id"});
				}
				else {
					console.log(`Card ID: ${query._id} deleted!`);
					res.send({code: config.codes.code_success, message: "Success"});

					if(card.default_card){
						let marchant = await pGCustomerService.getMarchant(card.payment_gateway_cust_id);
						if(marchant){
							let default_card = marchant.default_source;
							if(default_card){
								let response = await cardRepo.updateCard({payment_gateway_card_id: default_card}, {default_card: true});
								console.log('response: ', response);
							}
						}
					}
				}
			}
			else{
				console.log(`Payment gateway, Card could not deleted!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, Cart coul not deleted! Please validate your input."});
			}
		}
		else {
			console.log(`Payment gateway, card not found!`);
			res.send({code: config.codes.code_error, message: "Payment gateway, card not found!"});
		}
	}catch(error){
		console.log(`Some exceptions accured!`);
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	};
}

// UPDATE - set default
exports.setDefault = async (req, res) => {
	try{
		let query = { _id: req.body._id, payment_gateway_source_type: req.body.source };

		let postBody = req.body;
		postBody.last_modified = new Date();

		let card = await cardRepo.getOneByQuery(query);
		if (card){
			let cardUpdate = await cardService.updateMarchantCardSetDefault(card.payment_gateway_cust_id, card.payment_gateway_card_id);
			if(cardUpdate){
				postBody.default_card = true;
				postBody.active = true;
				let result = await cardRepo.updateCard(query, postBody);

				// And set all other cards to default: false
				query = {}, postBody = {};
				query._id = { $nin: [ req.body._id ] };
				query.payment_gateway_source_type = req.body.source;

				postBody.default_card = false;
				postBody.active = true;
				postBody.last_modified = new Date();

				result = await cardRepo.updateAllCard(query, postBody);
				if (result.nModified == 0) {
					console.log('Card not found!');
					res.send({code: config.codes.code_error, message: "Card not found!"});
				}
				else {
					console.log(`Card is Updated!`);
					res.send({code: config.codes.code_success, message: "Success!"});
				}
			}
			else {
				console.log(`Payment gateway, Card could not updated!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, Cart coul not updated! Please validate your form input."});
			}
		}
		else {
			console.log(`Payment gateway, card not found!`);
			res.send({code: config.codes.code_error, message: "Payment gateway, card not found!"});
		}
	}catch(error){
		console.log(`Some exceptions accured!`);
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	}
}

// GET - get default
exports.getDefault = async (req, res) => {
	try{
		let query = { user_id: req.query.user_id, source: req.query.source };

		let customer = await pGCutomerRepo.findOneByQuery(query);
		if (customer){

			let marchant = await pGCustomerService.getMarchant(customer.source_customer_id);
			if(marchant){
				
				let default_card = marchant.default_source;
				if(default_card){
					let result = {
						user_id: req.query.user_id,
						source_customer_id: customer.source_customer_id,
						default_card: default_card
					}
					console.log('result: ', result);
					res.send({code: config.codes.code_success, data: result});
				}
			}
			else {
				console.log(`Payment gateway, Card could not updated!`);
				res.send({code: config.codes.code_error, message: "Payment gateway, Cart coul not updated! Please validate your form input."});
			}
		}
		else {
			console.log(`Payment gateway, card not found!`);
			res.send({code: config.codes.code_error, message: "Payment gateway, card not found!"});
		}
	}catch(error){
		console.log(`Some exceptions accured!`);
		res.send({code: config.codes.code_error, message: "Some exceptions accured! Please contact the support team.", details: error.message});
	}
}

