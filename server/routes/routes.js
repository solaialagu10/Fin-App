const express = require("express");
const userModel = require("../models");
const {getUsers, getUserById, addUser, editUser, deleteUser} = require("../controllers/UserController"); 
// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/users",getUsers);

router.get("/user/:id",getUserById);

router.post("/add_customer",addUser);

router.post("/update/:id",editUser);

router.delete("/delete/:id",deleteUser);


module.exports = router;