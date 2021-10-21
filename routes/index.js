const express = require('express');
const router = express.Router();

router.use('/charge',    require('./chargeRoutes'));


module.exports = router;