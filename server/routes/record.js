const express = require("express");
const userModel = require("../models");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

const app = express();

recordRoutes.route("/users").get(async (request, response) => {
  console.log("Getting user")
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

recordRoutes.route("/add_user").post(async (request, response) => {
  const user = new userModel({
    name: request.body.name,
    position: request.body.position,
    level: request.body.level,
  });
  console.log("<>< Add user "+user); 
  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

// This section will help you get a single record by id
recordRoutes.route("/user/:id").get(async function (req, res) {
  const user = await userModel.findById(req.params.id);
  try {
    res.send(user);  
  } catch (error) {
    res.status(500).send(error);
  }
 });
 
 
// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(async function (req, response) {
  
  let myquery = { _id: req.params.id }; 
  let newvalues = {    
      name: req.body.name,
      position: req.body.position,
      level: req.body.level    
  };
  const user = await userModel.findOneAndUpdate(myquery,newvalues,{
    returnOriginal: false
  });
  response.send(user);
 });

 
// This section will help you delete a record
recordRoutes.route("/delete/:id").delete(async (req, response) => {
  console.log("Delete a record "+JSON.stringify(req.body));
  let myquery = { _id: req.params.id }
  await userModel.findOneAndRemove(myquery,req.body);
  response.send();
 });
 
module.exports = recordRoutes;