const mongoose = require("mongoose");

const {Invoice} = require("../models/invoiceModel");


const customerInvoice = async (req, res) => {  
  console.log("Invoice Data "+JSON.stringify(req.body));
    const invoice = new Invoice({
        ... req.body,
        createdDate: new Date(),
        modifiedDate: new Date()
      });
      try {
        await invoice.save();
        res.send(invoice);
      } catch (error) {
        console.log("<><>< error"+error);
        res.status(500).send(error);
      }  
};



module.exports ={
  customerInvoice
}