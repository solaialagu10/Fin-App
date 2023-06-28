const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  location: {
    type: String
  },
  mobileNo: {
    type: Number
  },
  email:{
    type: String
  },
  createdDate: {
    type: Date
  },
  modifiedDate: {
    type: Date
  }
});
function loadModel(modelName, modelSchema) {
  return mongoose.models[modelName] // Check if the model exists
    ? mongoose.model(modelName) // If true, only retrieve it
    : mongoose.model(modelName, modelSchema) // If false, define it
}
const Customer = loadModel("Customer", CustomerSchema);

module.exports.Customer = Customer;