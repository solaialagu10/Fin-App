const express = require("express");
const userModel = require("../models");
const {getProducts, getUserById, addUser, editProduct, deleteProduct,addProduct} = require("../controllers/UserController"); 
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/products",getProducts);

router.get("/user/:id",getUserById);

router.post("/add_customer",addUser);

router.post("/add_product",addProduct);

router.post("/update",editProduct);

router.post("/delete",deleteProduct);


module.exports = router;