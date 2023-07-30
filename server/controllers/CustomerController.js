const mongoose = require("mongoose");
const {Customer} = require("../models/customerModel");
const {Paid} = require("../models/paidModel");
const getCustomers = async (req, res) => {    
  const customers = await Customer.find({userId:req.user});     
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
        modifiedDate: new Date(),
        userId: req.user
      });
      try {
        await user.save();
        getCustomers(req,res);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};
const deleteCustomer = async (req, res) => {
  var toDelete = [];  
  req.body.forEach(function(item){  
    toDelete.push(item);
  });
  const response = await Customer.deleteMany({_id:{$in:toDelete}});
  getCustomers(req,res);
};
const editCustomer = async (req, res) => {   
  let myquery = { _id: req.body._id }; 
  let newvalues = {    
        ...req.body,
        modifiedDate: new Date()
  };
  await Customer.findOneAndUpdate(myquery,newvalues,{
    returnOriginal: false
  });
  getCustomers(req,res);
};
const updateCustomerAmount = async (req, res) => {    
  let customers = req.body;
  var promises = customers.map(async (customer)=>{
    if(customer['amountPaid']?.length>0){
      customer['totalBalance'] = customer['totalBalance'] - customer['amountPaid'];
     const response  = await updateCustomerdetailsFunc(customer,req.user);    
     return new Promise((res, rej) => {res(response)});
    }
  })
  Promise.all(promises)
  .then((results)=>{
    getCustomers(req,res); 
  });
};
const updateCustomerdetailsFunc = async(customer,user) =>{
  let myquery = { _id: customer._id }
  let newvalues = {    
    totalBalance: customer.totalBalance,
    modifiedDate: new Date()
  };
 await Customer.findOneAndUpdate(myquery,newvalues,{
  returnOriginal: false
});
const paid = new Paid({
  customerId: customer._id ,
  amount:customer.amountPaid,
  date: new Date(),
  userId: user
});
return await paid.save();
}
module.exports ={
    addCustomer,
    getCustomers,
    deleteCustomer,
    editCustomer,
    updateCustomerAmount
}