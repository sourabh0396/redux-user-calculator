const mongoose = require("mongoose");

const calculatorLogSchema = new mongoose.Schema({
  // id: { type: Number, required: true }, // Custom sequential ID
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  // expression: { type: String, required: true },
  // isValid: { type: Boolean, required: true },
  // output: { type: Number, required: true },
  // createdOn: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
expression: {
    type: String,
    required: true
},
isValid: {
    type: Boolean,
    required: true
},
output: {
    type: mongoose.Schema.Types.Mixed,
    required: true
},
// createdon: {
//     type: Date,
//     default: Date.now
// }

createdOn: { type: Date, default: Date.now }
});

const CalculatorLog = mongoose.model("CalculatorLog", calculatorLogSchema);

module.exports = CalculatorLog;
