const httpStatus = require('http-status');
const responseBody = {statusCode: '',data:{},msg:'',errMsg:'',err:null}

const validate = (schema) => (req, res, next) => {
  if(req.body && req.body.key && req.body.value){
    return next();
  } 
  else{
    _logger.error("~ Error occurred while processing request. Please try again later");
    responseBody.statusCode ='400';responseBody.msg = 'Fail';
    responseBody.errMsg = 'Error occurred while processing getAllKeys request. Please try again later';
    responseBody.err = err;
    return res.send(responseBody)
  };
}

module.exports = validate;
