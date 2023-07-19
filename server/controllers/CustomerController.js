const mongoose = require("mongoose");

const {Customer} = require("../models/customerModel");
const {Paid} = require("../models/paidModel");

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
  const paid = new Paid({
    customerId: req.body._id,
    amount:req.body.amountPaid,
    date: new Date()
  });
  await paid.save();
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