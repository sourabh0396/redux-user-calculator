const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 15
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 115
  },
  homeAddress: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100
  },
  primaryColor: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  secondaryColor: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  logo: {
    type: String,
    required: true,
    match: /^https:\/\/.*$/,
    minlength: 10,
    maxlength: 500
  }
});

module.exports = mongoose.model('User', userSchema);
