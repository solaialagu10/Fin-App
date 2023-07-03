const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
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
const Product = loadModel("Product", ProductSchema);

module.exports.Product = Product;