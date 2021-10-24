const express = require('express');
const router = express.Router();
const controller = require('../controllers/cardController');


router.route('/')
    .get(controller.get)
    .post(controller.post)
    .put(controller.put)
    .delete(controller.delete);

router.route('/get-default').get(controller.getDefault);
router.route('/set-default').post(controller.setDefault);

module.exports = router;