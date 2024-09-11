// const mongoose = require('mongoose');

// const counterSchema = new mongoose.Schema({
//   // _id: String, // Identifier for the counter
//   // sequence_value: Number
  
//   _id: { type: String, required: true }, // Sequence name
//   sequence_value: { type: Number, default: 0 }, // Current sequence value
// });

// const Counter = mongoose.model('Counter', counterSchema);

// module.exports = Counter;

const mongoose = require("mongoose");

// Define the schema for sequence numbers
const SequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Sequence name
  sequence_value: { type: Number, default: 0 }, // Current sequence value
});

// Export the model based on the schema
module.exports = mongoose.model("Sequence", SequenceSchema);
