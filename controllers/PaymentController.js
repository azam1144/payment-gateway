const container = require("../configurations/container");

const PaymentService = require("../services/PaymentService");
const CardService = require("../services/CardService");

const userRepo = container.resolve('userRepository');
const cardRepo = container.resolve('cardRepository');
const paymentRepo = container.resolve('paymentRepository');

const paymentService = new PaymentService();
const cardService = new CardService();

exports.create = async (req,res) => {

    try {
        let postBody = req.body;
        if( !postBody.cname || !postBody.ccard || !postBody.cccvv || !postBody.ccmonth || !postBody.ccyear ){
            return res.send({code: '-1', error: "Plz filled the fields properly"});
        }

        let user = await userRepo.getUserById(req.clientID);
        console.log('user: ', user); 
        
        res.send({status: true});
        return;

        if (!user.stripe_cust_id){
            //create customer at stripe
            let client = {};
            client.name = user.username;
            client.email = user.email;
            client.phone = user.phone;
            client.city = user.city;

            console.log('client: ', client);

            let stripeCustomer = await paymentService.createMarchant(client)
            if(stripeCustomer){
                //create customer in db
                await userRepo.updateUser({_id: req.clientID}, {stripe_cust_id: stripeCustomer.id});
            }
        }


        let card = await cardRepo.getCardByUserId({_id: req.clientID});
        if (!card){

            // create card at at Stripe
            let newCard = await cardService.createMarchantCard(postBody, user);

            // Add new user's card in DB
            await cardRepo.createCard(newCard.id, postBody);

        }

        //Create payment at stripe
        let billingObj = {};
        let stripeCharge = await paymentService.createCharge(postBody.amount);
        if (stripeCharge){
            billingObj.user_id = req.clientID;
            billingObj.transaction_id = stripeCharge.id;
            billingObj.transactionId = stripeCharge.balance_transaction;
            billingObj.card_id = stripeCharge.payment_method;
            billingObj.amount = stripeCharge.amount/100;
            billingObj.paid = stripeCharge.paid;
            billingObj.status = stripeCharge.status;
            billingObj.description = stripeCharge.description;
            billingObj.invoice_id = stripeCharge.receipt_url;

           await paymentRepo.createBilling(billingObj);
        }


    } catch(err) {
        console.log('err.message: ', err.message);

        // res.send({code: -1, error: "Some thing went wrong!", details: err.message});
        res.send({code: -1, error: err.message, details: err.message});
    }
};