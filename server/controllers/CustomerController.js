const mongoose = require("mongoose");

const {Customer} = require("../models/customerModel");

const getUserById = async (req, res) => {    
    const user = await productModel.findById(req.params.id);
    try {
      res.send(user);  
    } catch (error) {
      res.status(500).send(error);
    }
};

const getCustomers = async (req, res) => {    
  const customers = await Customer.find({});      
  try {
    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }      
};


const addCustomer = async (req, res) => {  
    const user = new Customer({
        ... req.body,
        createdDate: new Date(),
        modifiedDate: new Date()
      });
      try {
        await user.save();
        res.send(user);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};


const deleteCustomer = async (req, res) => {  
  const toDelete = req.body.selected ;
  await Customer.deleteMany({_id:{$in:toDelete}});
  res.send();     
};


const editCustomer = async (req, res) => {   
  console.log(req.body._id);
  let myquery = { _id: req.body._id }; 
  let newvalues = {    
        ...req.body,
        modifiedDate: new Date()
  };
  const customer = await Customer.findOneAndUpdate(myquery,newvalues,{
    returnOriginal: false
  });
  res.send(customer);
};

const updateCustomerAmount = async (req, res) => {   
  let myquery = { _id: req.body._id }; 
  let newvalues = {    
        totalBalance: req.body.totalBalance,
        modifiedDate: new Date()
  };
  const customer = await Customer.findOneAndUpdate(myquery,newvalues,{
    returnOriginal: false
  });
  res.send(customer);
};

module.exports ={
    getUserById,
    addCustomer,
    getCustomers,
    deleteCustomer,
    editCustomer,
    updateCustomerAmount
}