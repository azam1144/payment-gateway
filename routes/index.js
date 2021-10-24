const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/auth');

// a middleware function with no mount path. This code is executed for every request to the router
// router.use(async function (req, res, next) {
//     let authorized = await authMiddleWare.authorization(req, res);
//     console.log('authorized: ', authorized);

//     if (authorized) next();
//     else return false;
// })

router.use('/payment',    require('./payment'));
router.use('/user',    require('./user'));
router.use('/card',    require('./card'));
router.use('/pg-customer',    require('./pgCustomer'));


module.exports = router;