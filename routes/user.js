const express = require('express');
const router = express.Router();
const controller = require('../controllers/UserController');

//POST
router.route('/login').post(controller.login);
router.route('/register').post(controller.post);

router.route('/')
    .get(controller.get)
    .put(controller.put)
    .delete(controller.delete);

module.exports = router;