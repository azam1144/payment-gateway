const express = require('express');
const router = express.Router();

router.use('/charge',    require('./charge'));
router.use('/user',    require('./user'));


module.exports = router;