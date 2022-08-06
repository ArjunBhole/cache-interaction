const constant  = require('../constants/constant')
const config = {
    redis:{
        host: constant.REDIS_HOST,
        port: Number(constant.REDIS_PORT)
    }
}
module.exports =config;