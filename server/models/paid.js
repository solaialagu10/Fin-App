const mongoose = require("mongoose");

const PaidSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  amount:{
    type: Number,
    required: true
  }, 
  date: {
    type: Date
  },
  userId: {
    type: String
  }
});
function loadModel(modelName, modelSchema) {
  return mongoose.models[modelName] // Check if the model exists
    ? mongoose.model(modelName) // If true, only retrieve it
    : mongoose.model(modelName, modelSchema) // If false, define it
}
const Paid = loadModel("Paid", PaidSchema);

module.exports.Paid = Paid;