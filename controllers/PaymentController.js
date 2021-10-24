const container = require("../configurations/container");
const config = require('../config');
const PaymentService = require("../services/PaymentService");
const CardService = require("../services/CardService");

const userRepo = container.resolve('userRepository');
const cardRepo = container.resolve('cardRepository');
const paymentRepo = container.resolve('paymentRepository');
const pGCutomerRepo = container.resolve('pGCutomerRepository');

const paymentService = new PaymentService();
const cardService = new CardService();

exports.create = async (req,res) => {

    try {
        let postBody = req.body;
        let clientID = req.query.clientID;
        if( !postBody.cus_name || !postBody.cus_card || !postBody.cus_cvc || !postBody.cus_exp_month || !postBody.cus_exp_year ){
            return res.send({code: '-1', error: "Plz filled the fields properly"});
        }

        let pgcustomer = await pGCutomerRepo.findOneByQuery({user_id: clientID, source: postBody.source});
        if (pgcustomer){
            if(!pgcustomer.active){
                //create/update a new payment gateway for a customer (existing or new)
                pgcustomer = await pGCutomerRepo.updatePGCustomer({_id: pgcustomer._id}, {active: true});
            }
        }
        else{
            //create customer at stripe
            let user = await userRepo.getUserById(clientID);
            if(!user){
                user = await userRepo.createUser({name: "Azam", email: "azm@gmail.com", phone: "923087650052", city: "islamabad"});
            }

            let client = {};
            client.name = user.name;
            client.email = user.email;
            client.phone = user.phone;
            client.city = user.city;

            let newPgcustomer = await paymentService.createMarchant(client);
            console.log('newPgcustomer: ', newPgcustomer);
            if(newPgcustomer){
                //create customer in db
                let pgCutomer = {};
                pgCutomer.source = postBody.source;
                pgCutomer.source_customer_id = newPgcustomer.id;
                pgCutomer.user_id = clientID;
                pgCutomer.active = true;

                // create/update a record in DB for customer as new payment gateway type, e.g "stripe"
                pgcustomer = await pGCutomerRepo.updatePGCustomer({user_id: clientID, source: postBody.source}, pgCutomer);
            }
       }

        console.log('pgcustomer: ', pgcustomer);

        if(postBody.card_id){
            let card = await cardRepo.getOneByQuery({_id: postBody.card_id});

            if (card){
                if(!card.active){
                    cardRepo.updateCard({_id: card._id}, {active: true});
                }
            }
        }
        else{

            let card_token = null;
            if(postBody.cardToken){
                card_token = postBody.cardToken;
            }
            else{
                // Generate a token by card information
                card_token = await cardService.createMarchantCardToken(postBody);
                card_token = card_token.id;
            }

            // create a new card for this customer
            let newCard = await cardService.createMarchantCard(card_token, pgcustomer.source_customer_id);
            
            // Add new user's card in DB
            if (newCard){

                postBody.user_id = clientID;
                postBody.payment_gateway_card_id = newCard.id;
                postBody.payment_gateway_cust_id = pgcustomer.source_customer_id;
                postBody.payment_gateway_source_type = postBody.source;

                cardRepo.createCard(postBody);
            }
        }

        //Create payment at stripe
        let billingObj = {};
        let stripeCharge = await paymentService.createCharge(postBody.amount, pgcustomer.source_customer_id);
        if (stripeCharge.status === 'succeeded'){
            billingObj.user_id = clientID;
            billingObj.transaction_id = stripeCharge.id;
            billingObj.transactionId = stripeCharge.balance_transaction;
            billingObj.card_id = stripeCharge.payment_method;
            billingObj.payment_source = postBody.source;
            billingObj.amount = stripeCharge.amount/100;
            billingObj.paid = stripeCharge.paid;
            billingObj.status = stripeCharge.status;
            billingObj.description = stripeCharge.description;
            billingObj.invoice_id = stripeCharge.receipt_url;

            console.log('billingObj: ', billingObj);

           await paymentRepo.createBilling(billingObj);
        }

        res.send({status: config.codes.code_success, message: "Payment is done!"});
    } catch(err) {
        console.log('err.message: ', err.message);

        // res.send({code: -1, error: "Some thing went wrong!", details: err.message});
        res.send({code: -1, error: err.message, details: err.message});
    }
};