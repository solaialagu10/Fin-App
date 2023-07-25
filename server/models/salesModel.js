const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  qty:{
    type: Number,
    required: true
  }, 
  timeline:{
    type: String,
    required: true,
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
const Sales = loadModel("Sales", SalesSchema);

module.exports.Sales = Sales;