const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true
  },
  mobileNo: {
    type: Number,
    required: false
  },
  email:{
    type: String,
    required: false
  },
  retailPrices:{
    type: Object,
    required: true
  },
  wholeSalePrices:{
    type: Object
  },
  totalBalance:{
    type: Number
  },
  outstandingBalance:{
    type: Number
  },
  amountPaid:{
    type: Number
  },
  createdDate: {
    type: Date
  },
  modifiedDate: {
    type: Date
  },
  userId:{
    type:String,
    required:true
  }
});
function loadModel(modelName, modelSchema) {
  return mongoose.models[modelName] // Check if the model exists
    ? mongoose.model(modelName) // If true, only retrieve it
    : mongoose.model(modelName, modelSchema) // If false, define it
}
const Customer = loadModel("Customer", CustomerSchema);

module.exports.Customer = Customer;