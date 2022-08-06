const config = require('../config/config');
const redis = require('redis')

// let _connection;

// const closeConnection = () => {
//   _connection.quit();
// }

// /**
//  * Connects to redis using config/config.js
//  * @returns Promise<Db> redis Db instance
//  */
// const getRedisConnection = async () => {
//   if (_connection) {
//     return _connection;
//   }
//   console.log('trying to connect to redis',config);
//   let options = {
//     host: config.redis.host,
//     port: config.redis.port
//   }
//   const redisClient = redis.createClient(options);
//   _connection = await redisClient.connect();
//   console.log("Redis Connection::::::", _connection)
//   return _connection;
// }

// module.exports = { getRedisConnection, closeConnection };




class Redis {

  constructor(){
      this._connection = {}
  }

  getRedisConnection = async () => {
    console.log("Inside the get Redis Connection function")
    if (this._connection) {
      return this._connection;
    }
    console.log('trying to connect to redis',config);
    let options = {
      host: config.redis.host,
      port: config.redis.port
    }
    this._connection = await redis.createClient(options);
    console.log("Redis Connection::::::", this._connection)
    return this._connection;
  }

  closeConnection =()=>{
      this._connection.quit();
  }

}

const redisClient = new Redis()

module.exports = redisClient