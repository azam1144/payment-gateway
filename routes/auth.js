const express = require('express');
const router = express.Router();
const controller = require('../controllers/AuthController');

router.route('/refresh').post(controller.refresh);

module.exports = router;