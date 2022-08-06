const httpStatus = require('http-status');
// const pick = require('../utils/pick');
const ApiError = require('../_util/ApiError');
const catchAsync = require('../_util/catchAsync');
const redisService  = require('../services/redis.service');
const _logger = require('../_util/logger');
const responseBody = {statusCode: '',data:{},msg:'',errMsg:'',err:null}

const getAllKeys = catchAsync(async (req, res) => {
  _logger.info("Inside getAllKeys ~API")
  redisService.getAllKeys().then((result)=>{
    res.send(result)
  })
  .catch(errResult=>{
  _logger.error();("~ Error occured in getAllKeys",errResult)
    res.send(errResult)
  })
  _logger.info("Existing getAllKeys ~API")

});

const delAllKeys = catchAsync(async (req, res) => {
  _logger.info("Inside delAllKeys ~API")

  redisService.delAllKeys().then((result)=>{
    res.send(result)
  })
  .catch(errResult=>{
  _logger.error();("~ Error occured in delAllKeys",errResult)
    res.send(errResult)
  })

  _logger.info("Existing delAllKeys ~API")

});

const getKey = catchAsync(async (req, res) => {
  _logger.info("Inside getKey ~API", req.params)

  if(req.params && req.params.key){
    redisService.getKey(req.params.key).then((result)=>{
      res.send(result)
    })
    .catch(errResult=>{
    _logger.error();("~ Error occured in getKey",errResult)
      res.send(errResult)
    })
  }else{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing getKey request. Please try again later';
    responseBody.err = {};
    res.send(responseBody)
  }

  _logger.info("Existing getKey ~API")

});

const updateKey = catchAsync(async (req, res) => {
  _logger.info("Inside updateKey ~API", req.body)
  if(req.body && req.body.key && req.body.value){

    redisService.updateKey(req.body).then((result)=>{
      res.send(result)
    })
    .catch(errResult=>{
    _logger.error();("~ Error occured in updateKey",errResult)
      res.send(errResult)
    })
  }
  else{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing updateKey request. Please validate your input. Request must contatin a key and a value as per the error object';
    responseBody.data = { }
    responseBody.err = { key:'',value:''};
    res.send(responseBody)
  }
  _logger.info("~ Exiting updateKey ~API")
});

const deleteKey = catchAsync(async (req, res) => {
  _logger.info("Inside deleteKey ~API", req.params)

  if(req.params && req.params.key){

    redisService.deleteKey(req.params.key).then((result)=>{
      res.send({statusCode: 200, data : result})
    })
    .catch(errResult=>{
    _logger.error();("~ Error occured in deleteKey",errResult)
      res.send(errResult)
    })
  }
  else{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing deleteKey request. Please validate your input';
    responseBody.data = { }
    responseBody.err = {};
    res.send(responseBody)
  }
  _logger.info("~ Exiting deleteKey ~API")
});

const addKey =  catchAsync(async (req, res) => {
  _logger.info("Inside addKey ~function", req.body)

  if(req.body && req.body.key && req.body.value){

  
  redisService.addKey(req.body).then((result)=>{
    res.send(result)
  })
  .catch(errResult=>{
  _logger.error();("~ Error occured in addKey",errResult)
    res.send(errResult)
  })
  }
  else{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing addKey request. Please validate your input. Request must contatin a key and a value as per the error object';
    responseBody.data = { }
    responseBody.err = { key:'',value:''};
    res.send(responseBody)
  }
  _logger.info("~ Exiting addKey ~API")

});

module.exports = {
  getAllKeys,
  delAllKeys,
  getKey,
  updateKey,
  deleteKey,
  addKey
};
