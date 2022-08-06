const express = require('express');
const redisRoute = require('./redis_route');
const router = express.Router();

router.use('/redis', redisRoute)

module.exports = router;