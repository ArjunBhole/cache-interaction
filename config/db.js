// const mongoDB = require('./mongodb');
const redisClient = require('./redis');

class DbService {

    constructor(){
        this.redis = {}
    }

    connect(){
        console.log("Inside the connect function")
        this.redis = redisClient.getRedisConnection()
        return this.redis;
        
    }


    close(){
        this.redis = redisClient.closeConnection();
    }


}

const db = new DbService();
module.exports = db;
