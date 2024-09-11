// const Joi = require('joi');

// const registerValidation = Joi.object({
//   firstName: Joi.string().min(3).max(15).required(),
//   lastName: Joi.string().min(3).max(15),
//   password: Joi.string().min(7).max(15),
//   email: Joi.string().min(5).max(50).email().required(),
//   age: Joi.number().min(10).max(115).required(),
//   homeAddress: Joi.string().min(10).max(100).required(),
//   primaryColor: Joi.string().min(3).max(10).required(),
//   secondaryColor: Joi.string().min(3).max(10).required(),
//   logo: Joi.string().uri().min(10).max(500).required(),
// });

// const loginValidation = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });

// module.exports = { registerValidation, loginValidation };
