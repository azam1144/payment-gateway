const express = require('express');
const router = express.Router();
const controller = require('../controllers/PaymentController');

router.route('/create')
    .post(controller.create);

module.exports = router;