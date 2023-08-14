const mongoose = require("mongoose");
const {Customer} = require("../models/customer");
const {Invoice} = require("../models/invoice");
const {Paid} = require("../models/paid");
var moment = require('moment');
const getCustomers = async (req, res) => {    
  const customers = await Customer.find({userId:req.user}).sort({ "customerName": 1 });     
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
      customer['outstandingBalance'] = customer['totalBalance'] ;
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
  let myquery1 = { customerId: customer._id,modifiedDate : {$gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()} }
  let newvalues1 = {    
    outstandingBalance: customer.outstandingBalance,
    modifiedDate: new Date()
  };
  await Customer.findOneAndUpdate(myquery,newvalues,{
    returnOriginal: false
  });
 await Invoice.findOneAndUpdate(myquery1,{$inc:{outstandingBalance : - customer.amountPaid}},{
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

const getPaidTotals =async (req,res)=>{

  try{
    const paidTotal =  await Paid.aggregate([   
            { $match : {
                "date" : {
                $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
            },
            "userId"   : (req.user).toString()}
            },
            {
            $group : {
                "_id" :"$customerId",
                paidTotal : {$sum: "$amount"},
            }
            }            
      ])
      res.send(paidTotal);
  }
  catch(err){
    console.log("<><>< error"+err);
    res.status(500).send(err);
  }
}

module.exports ={
    addCustomer,
    getCustomers,
    deleteCustomer,
    editCustomer,
    updateCustomerAmount,
    getPaidTotals
}