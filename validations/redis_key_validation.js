const Joi = require('joi');

const inputKey = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    value: Joi.string().required()
  })
};


module.exports = {
  inputKey
};
