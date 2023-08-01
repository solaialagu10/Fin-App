const {Invoice} = require("../models/invoice");
const {Customer} = require("../models/customer");
const {Sales} = require("../models/sales");
const {Paid} = require("../models/paid");
var moment = require('moment');
const jwt = require("jsonwebtoken");
const express =  require("express");
const router = express.Router();
const passport = require('passport');
require('../auth/passport');

const addCustomerInvoice = async (req, res) => {  
  let myquery = {_id: req.body._id}; 
  "_id email location mobileNo wholeSalePrices".split(" ").forEach(e => delete req.body[e]);  
    const invoice = new Invoice({
        ... req.body,
        customerId: myquery._id,
        createdDate: new Date(),
        modifiedDate: new Date(),
        userId: req.user
      });      
      let newvalues = {    
            totalBalance: req.body.totalBalance,
            modifiedDate: new Date()
      };    
        
      try {        
        const resp = await invoice.save();
        await Customer.findOneAndUpdate(myquery,newvalues,{
          returnOriginal: false
        });
        const value = await Sales.find({ $and:[{userId:req.user},{timeline : req.body.timeline}, {modifiedDate : {$gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()}}]});

        if(value.length == 0){
          Object.keys(req.body.qtys).forEach(function (key,index) { 
            const sales = new Sales({
              invoiceId:resp._id,
              productName: key.substring(3),
              timeline: req.body.timeline,
              qty: req.body.qtys[key],
              createdDate: new Date(),
              modifiedDate: new Date(),
              userId:req.user});
              sales.save();
        })}
        else{
          Object.keys(req.body.qtys).forEach(function (key,index) {                 
            updateFun(Sales,req,key);
        })
        }      
        let customers = await Customer.find({userId:req.user});  
        res.send(customers);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};



const updateFun = async(Sales,req,key) =>{
  await Sales.findOneAndUpdate({timeline : req.body.timeline, productName:key.substring(3), modifiedDate : {
    $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
    },userId:req.user},
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
                  },
                  "userId": (req.user).toString()
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
              "timeline" : req.body.input,
              "userId":(req.user).toString()
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

const getWinningAmount = async(req,res) =>{
  try {
    const amount = await Invoice.aggregate([
      {
        $match : {
          "modifiedDate" : {
              $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
          },
          "timeline" : req.body.input,
          "userId":(req.user).toString()
        }
    },
      {
        $group : {
          "_id" :{product:"$userId"},
          qty : {$sum: "$winningAmount"},    
        }
    }         
  ]);   
    res.send(amount);
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
            $gte : moment().hours(0).minutes(0).seconds(0).milliseconds(0).toDate()
        },
        "userId":req.user
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

const getPaidList = async (req,res,next) =>{
//   {
//     "date" : { $gte: moment().subtract(3, 'days').toDate() }
//     "date" : {$gte: new Date((new Date().getTime() - (15 * 24 * 60 * 60 * 1000)))}
// },
  try {  
    // const userName = req.headers['authorization'];
    const paidList = await Paid.aggregate([
      {$match: {
        $and:[
        {
      $expr: {
        $gte: ["$date",
               { $dateSubtract: { startDate: "$$NOW", unit: "day", amount: 3 } }
       ]
      }
    },{"userId":(req.user).toString()}]}},
    {     
      $project:
      {   
      _id:0,amount:1,customerId:1,date:{
                   $dateToString:
                      {
                         format: "%d-%m-%Y %H:%M",
                         date: "$date"
                      }
                }
      }
  }     
]
).sort({ "date": -1 });   
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
  getPaidList,
  getWinningAmount
}