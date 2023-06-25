const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productId: {
    type: String
  },
  price: {
    type: Number
  },
  createdDate: {
    type: Date
  },
  modifiedDate: {
    type: Date
  }
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;