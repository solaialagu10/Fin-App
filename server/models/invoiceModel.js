const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerId:{
    type: String 
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
  retailPrices:{
    type: Object    
  },
  wholeSalePrices:{
    type: Object
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
  totalCost:{
    type: Number,
  },
  timeline:{
    type: String,
    required: true
  },
  totalBalance:{
    type: Number
  },
  createdDate: {
    type: Date
  },
  modifiedDate: {
    type: Date
  },  
  winningAmount:{
    type: Number
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
const Invoice = loadModel("Invoice", InvoiceSchema);

module.exports.Invoice = Invoice;