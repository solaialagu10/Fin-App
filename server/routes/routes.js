const express = require("express");
const {getProducts, editProduct, deleteProduct,addProduct} = require("../controllers/ProductController"); 
const {addCustomer, getCustomers,deleteCustomer,editCustomer,updateCustomerAmount} = require("../controllers/CustomerController"); 
const {addCustomerInvoice, customerInvoices, daySaleReport,getBIlledInvoices,getPaidList} = require("../controllers/InvoiceController"); 
const  registerApi = require("../controllers/register"); 
const  loginApi = require("../controllers/login"); 
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const passport = require("passport");

const router = express.Router();

router.get("/products",passport.authenticate('jwt', { session: false }),getProducts);

router.post("/add_product",passport.authenticate('jwt', { session: false }),addProduct);

router.post("/update",passport.authenticate('jwt', { session: false }),editProduct);

router.post("/delete",passport.authenticate('jwt', { session: false }),deleteProduct);

router.post("/add_customer",passport.authenticate('jwt', { session: false }),addCustomer);

router.get("/customers",passport.authenticate('jwt', { session: false }),getCustomers);

router.post("/deleteCustomer",passport.authenticate('jwt', { session: false }),deleteCustomer);

router.post("/edit_customer",passport.authenticate('jwt', { session: false }),editCustomer);

router.post("/update_amount",passport.authenticate('jwt', { session: false }),updateCustomerAmount);

router.post("/add_invoice",passport.authenticate('jwt', { session: false }),addCustomerInvoice);

router.get("/get_invoices",passport.authenticate('jwt', { session: false }),customerInvoices);

router.post("/day_sales_report",passport.authenticate('jwt', { session: false }),daySaleReport);

router.get("/billedInvoices",passport.authenticate('jwt', { session: false }),getBIlledInvoices);

router.get("/paidList",passport.authenticate('jwt', { session: false }),getPaidList);

router.use(loginApi);

router.use(registerApi);






module.exports = router;