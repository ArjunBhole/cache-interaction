const express = require('express');
// const validate = require('../middlewares/validate');
// const redisKeyValidation = require('../validations/redis_key_validation');
const redisController = require('../controllers/redis.controller');

const router = express.Router();

router.get('/keys', redisController.getAllKeys)
router.delete('/keys', redisController.delAllKeys)
router.post('/key',redisController.addKey)
router.get('/:key',  redisController.getKey)
router.put('/:key',  redisController.updateKey);
router.delete('/:key', redisController.deleteKey);


module.exports = router;