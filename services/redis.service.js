const httpStatus = require('http-status');
// const ApiError = require('../_util/ApiError');
// const dbService = require('../config/db');
const config = require('../config/config');
const _logger = require('../_util/logger');
const randomstring = require("randomstring");
const redis = require('redis')
const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port
});
let responseBody = {statusCode: '',data:{},msg:'',errMsg:'',err:null}
const q = require('q');


const getAllKeys = async () => {
  _logger.info("~ Inside getAllKeys function")
  const result = q.defer()
  redisClient.connect()
  .then((connected)=>{
    _logger.info("Connnected to Redis checking....")
    return redisClient.keys('*')
  })
  .then((allKeys)=> {
    _logger.info("All Keys",allKeys)
    responseBody.statusCode ='200';
    responseBody.msg = 'Success';
    responseBody.errMsg = '';
    responseBody.err = null;
    responseBody.data = allKeys;
    result.resolve(responseBody);
  })
  .catch(err=>{
    _logger.error("~ Error occurred while processing getAllKeys request. Please try again later",err);
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing getAllKeys request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting getAllKeys function")
  return result.promise;
  
};


 const delAllKeys = async () => {
  _logger.info("~ Inside delAllKeys Service")
  const result = q.defer()
  redisClient.connect()
  .then((connected)=>{
    _logger.info("Connnected to Redis ....")
    return redisClient.flushAll()
  })
  .then((delResponse)=> {
    _logger.info("deleted key response",delResponse)
    responseBody.statusCode ='200';
    responseBody.msg = 'Success';
    responseBody.errMsg = '';
    responseBody.err = null;
    responseBody.data = delResponse;
    result.resolve(responseBody);
  })
  .catch(err=>{
    _logger.error("~ Error occurred while processing delAllKeys request. Please try again later",err);
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing delAllKeys request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting delAllKeys function")
  return result.promise;
  
};


function createRandomKey(){
  _logger.info("~ Inside createRandomKey function")

  const randomKey = randomstring.generate(4);
  const randomValue = randomstring.generate(7);
  const result = q.defer()
  redisClient.connect()
  .then((connected)=>{
    _logger.info("Connnected to Redis creating random key ...")
    return redisClient.set(randomKey,randomValue)
  })
  .then((data)=>result.resolve(data))
  .catch(err=>{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting createRandomKey function")
  return result.promise;
}

function checkIfExist(key){
  _logger.info("~ Inside checkIfExist function",key)
  const result = q.defer()
  redisClient.connect()
  .then(connected=>{
    _logger.info("Connnected to Redis checking if key already exist....")
    return redisClient.exists(key)
  })
  .then((keyExists)=>{
      if(keyExists)
      {
        _logger.info("Cache hit")
        result.resolve({keyExist: true})
      }else{
      _logger.info("Cache miss")
        result.resolve({keyExist: false})
      }
  })
  .catch(err=>{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting checkIfExist function")
  return result.promise;

}

function fetchKey(key){
  _logger.info("~ Inside fetchKey function")
  const result = q.defer()
  checkIfExist(key)
  .then((exists)=>{
    if(exists){
      _logger.info("Cache hit")
       return redisClient.get(key)
    }else{
      _logger.info("Cache miss")
      return createRandomKey()
    }
    
  })
  .then((data)=>result.resolve(data))
  .catch(err=>{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting fetchKey function")
  return result.promise;
}


const getKey = async (key) => {
  _logger.info("~ Inside Redis Key Key Service",key)
  const result = q.defer()
  fetchKey(key)
  .then((result)=> {
    _logger.info("Fetched Key",result)
    console.log("Fetched Result",result[0])
    responseBody.statusCode ='200';
    responseBody.msg = 'Success';
    responseBody.errMsg = '';
    responseBody.err = null;
    responseBody.data = result;
    result.resolve(responseBody);
  })
  .catch(err=>{
    _logger.error("~ Error occurred while processing get key request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing get key request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting Redis Add Key Service",reqBody)
  return result.promise;
};



const updateKey = async (reqBody) => {
  _logger.info("~ Inside Redis updateKey Service",reqBody)
  const result = q.defer()
  checkIfExist(reqBody.key)
  .then((exists)=>{
    if(exists){
       return redisClient.set(reqBody.key,reqBody.value)
    }else{
      responseBody.statusCode ='400';responseBody.msg = 'Fail';
      responseBody.errMsg = 'Error occurred while deleting key request. Key does not exist';
      responseBody.err = err;
      return result.resolve(responseBody)
    }
  })
  .then((data)=>result.resolve(data))
  .catch(err=>{
    _logger.error("~ Error occurred while processing update key request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing update key request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting updateKey Service")
  return result.promise;
};


const deleteKey = async (key) => {
  _logger.info("~ Inside Redis deleteKey Service",key)
  const result = q.defer()
  checkIfExist(key)
  .then((exists)=>{
    if(exists){
       return redisClient.del(key)
    }else{
      responseBody.statusCode ='400';responseBody.msg = 'Fail';
      responseBody.errMsg = 'Error occurred while deleting key request. Key does not exist';
      responseBody.err = err;
      return result.resolve(responseBody)
    }
  })
  .then((data)=>result.resolve(data))
  .catch(err=>{
    _logger.error("~ Error occurred while processing delete key request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing delete key request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting deleteKey Service")
  return result.promise;
};

/*      */



 const addKey = async (reqBody)=>{
  _logger.info("~ Inside Redis addKey Service",reqBody)
  const result = q.defer()
  redisClient.connect()
  .then((connected)=>{
    _logger.info("Connected to redis... Adding Key", connected)
    redisClient.set('this is a testing key', 'testing value')
  })
  .then(()=> {
    responseBody.statusCode ='200';
    responseBody.msg = 'Success';
    responseBody.errMsg = '';
    responseBody.err = null;
    result.resolve(responseBody);
  })
  .catch(err=>{
    _logger.error("~ Error occurred while processing add key request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing add key request. Please try again later';
    responseBody.err = err;
    result.reject(responseBody);
  })
  _logger.info("~ Exiting Redis addKeyService",reqBody)
  return result.promise;
};

module.exports = {
  addKey,
  getKey,
  deleteKey,
  updateKey,
  getAllKeys,
  delAllKeys
};
