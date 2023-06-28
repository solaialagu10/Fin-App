const express = require("express");
const {getProducts, editProduct, deleteProduct,addProduct} = require("../controllers/ProductController"); 
const {addCustomer, getCustomers,deleteCustomer,editCustomer} = require("../controllers/CustomerController"); 
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/products",getProducts);

router.post("/add_product",addProduct);

router.post("/update",editProduct);

router.post("/delete",deleteProduct);

router.post("/add_customer",addCustomer);

router.get("/customers",getCustomers);

router.post("/deleteCustomer",deleteCustomer);

router.post("/edit_customer",editCustomer);



module.exports = router;