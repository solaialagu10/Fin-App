const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
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
    required: true
  },
  email:{
    type: String,
    required: true
  },
  retailPrices:{
    type: Object,
    required: true
  },
  qtys:{
    type: Object,
    required: true
  },
  totals:{
    type: Object,
    required: true
  },
  billTotal:{
    type: Number,
    required: true
  },
  timeline:{
    type: String,
    required: true
  },
  totalObalance:{
    type: Number
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
const Invoice = loadModel("Invoice", InvoiceSchema);

module.exports.Invoice = Invoice;