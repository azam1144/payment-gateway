const express = require('express');
const router = express.Router();
const controller = require('../controllers/PGCustomerController');

router.route('/')
    .get(controller.get)
    .post(controller.post)
    .put(controller.put)
    .delete(controller.delete);

module.exports = router;