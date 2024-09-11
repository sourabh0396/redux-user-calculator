
const mongoose = require("mongoose");

// Define the schema for sequence numbers
const SequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Sequence name
  sequence_value: { type: Number, default: 0 }, // Current sequence value
});

// Export the model based on the schema
module.exports = mongoose.model("Sequence", SequenceSchema);
