const mongoose = require("mongoose");

const {Product} = require("../models/product");

const getProducts = async (req, res) => {    
        const products = await Product.find({userId:req.user});      
        try {
          res.send(products);
        } catch (error) {
          res.status(500).send(error);
        }      
};

const addProduct = async (req, res) => {  
  const product = new Product({    
      ...req.body,
      createdDate: new Date(),
      modifiedDate: new Date(),
      userId: req.user
    });
    try {
      await product.save();
      getProducts(req,res);
    } catch (error) {
      res.status(500).send(error);
    }  
};

const editProduct = async (req, res) => {   
    let myquery = { _id: req.body._id }; 
    let newvalues = {    
      ...req.body,
      modifiedDate: new Date()
    };
    const user = await Product.findOneAndUpdate(myquery,newvalues,{
      returnOriginal: false
    });
    getProducts(req,res);
};


const deleteProduct = async (req, res) => {  
    var toDelete = [];  
    req.body.forEach(function(item){  
      toDelete.push(item);
    });
    const response = await Product.deleteMany({_id:{$in:toDelete}});
    getProducts(req,res);   
};

module.exports ={
    getProducts,
    editProduct,
    deleteProduct,
    addProduct
}