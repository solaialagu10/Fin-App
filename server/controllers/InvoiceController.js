const mongoose = require("mongoose");

const {Invoice} = require("../models/invoiceModel");
const {Customer} = require("../models/customerModel");
const {Sales} = require("../models/salesModel");
const {Paid} = require("../models/paidModel");
var moment = require('moment');

const addCustomerInvoice = async (req, res) => {  
  let myquery = {_id: req.body._id}; 
  "_id email location mobileNo wholeSalePrices".split(" ").forEach(e => delete req.body[e]);  
    const invoice = new Invoice({
        ... req.body,
        customerId: myquery._id,
        createdDate: new Date(),
        modifiedDate: new Date()
      });      
      let newvalues = {    
            totalBalance: req.body.totalBalance,
            modifiedDate: new Date()
      };    
        
      try {
        
        await invoice.save();
        await Customer.findOneAndUpdate(myquery,newvalues,{
          returnOriginal: false
        });
        const value = await Sales.find({ $and:[{timeline : req.body.timeline}, {modifiedDate : {$gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()}}]});
        if(value.length == 0){
          Object.keys(req.body.qtys).forEach(function (key,index) { 
            const sales = new Sales({
              productName: key,
              timeline: req.body.timeline,
              qty: req.body.qtys[key],
              createdDate: new Date(),
              modifiedDate: new Date()});
              sales.save();
        })}
        else{
          Object.keys(req.body.qtys).forEach(function (key,index) {                 
            updateFun(Sales,req,key);
        })
        }
      
        res.send(invoice);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};

const updateFun = async(Sales,req,key) =>{
  await Sales.findOneAndUpdate({timeline : req.body.timeline, productName:key, modifiedDate : {
    $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
    }},
    {$inc:{qty : req.body.qtys[key]}},{$set:{modifiedDate : new Date()}},{
      returnOriginal: false
    });
}

const customerInvoices = async (req, res) => {      
  //"modifiedDate":{ $gte: moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()}
      try {
        const invoices = await Invoice.aggregate([
          {
              $match : {
                  "modifiedDate" : {
                      $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
                  }
              }
          },
          {
               $lookup:
                   {
                     from: "customers",
                     localField: "customerName",
                     foreignField: "customerName",
                     as: "table"
                   }
          },
           { $unwind: { path: "$table", preserveNullAndEmptyArrays: true } },  
           {
              $group : {
                  "_id" :"$customerName",
                  billTotal : {$sum: "$billTotal"},
                  totalCost : {$sum: "$totalCost"},
                  winningAmount : {$sum: "$winningAmount"},
                  totalBalance: { "$first" : "$table.totalBalance"},
                  
              }
          }           
      ]);   
      
        res.send(invoices);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};

const daySaleReport = async (req, res) =>{
  try {
    const salesReport = await Sales.aggregate([
      {
          $match : {
              "modifiedDate" : {
                  $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
              },
              "timeline" : req.body.input
          }
      },
      {
           $lookup:
               {
                from: "products",
                localField: "productName",
                foreignField: "productId",
                as: "table"
               }
      },
       { $unwind: { path: "$table", preserveNullAndEmptyArrays: true } },  
       {
          $group : {
            "_id" :{product:"$productName",timeline:"$timeline"},
            productName:{"$first":"$table.productName"},
            timeline : {"$first": "$timeline"},
            qty : {$sum: "$qty"},
            price: { "$first" : "$table.price"}              
          }
      }           
  ]);   
    res.send(salesReport);
  } catch (error) {
    console.log("<><>< error"+error);
    res.status(500).send(error);
  }  
}

const getBIlledInvoices = async(req,res) =>{
  try {
    const billedInvoices = await Invoice.find(
      {
        "modifiedDate" : {
            $gte : new Date("2023-07-19")
        }
    },
    {        
        customerId:1,timeline:1,totalBalance:1,billTotal:1,qtys:1,retailPrices:1,winningAmount:1
    }         
  );   
    res.send(billedInvoices);
  } catch (error) {
    console.log("<><>< error"+error);
    res.status(500).send(error);
  }  
}

const getPaidList = async(req,res) =>{
  try {
    const paidList = await Paid.find(
      {
        "date" : {
            $gte : new Date("2023-07-19")
        }
    },
    {        
        amount:1,customerId:1,date:1
    }         
  );   
    res.send(paidList);
  } catch (error) {
    console.log("<><>< error"+error);
    res.status(500).send(error);
  }  
}

module.exports ={
  addCustomerInvoice,
  customerInvoices,
  daySaleReport,
  getBIlledInvoices,
  getPaidList
}