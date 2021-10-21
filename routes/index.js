const express = require('express');
const router = express.Router();

router.use('/users',    require('./usertRoutes'));

module.exports = router;