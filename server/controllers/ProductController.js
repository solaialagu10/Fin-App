const mongoose = require("mongoose");

const {Product} = require("../models/productModel");

const getProducts = async (req, res) => {    
        const products = await Product.find({});      
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
      modifiedDate: new Date()
    });
    try {
      await product.save();
      res.send(product);
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
    res.send(user);
};


const deleteProduct = async (req, res) => {  
    const toDelete = req.body.selected ;
    // let myquery = { _id: req.params.id }
    // var usersDelete = [];
    // var ObjectID = req.mongo.ObjectID;   //req is request from express
    // req.body.forEach(function(item){     //req.body => [{'_id' : ".." , "name" : "john"}]
    //   console.log("<>>>> item"+item._id);
    //   usersDelete.push(ObjectID(item));
    // });
    await Product.deleteMany({_id:{$in:toDelete}});
    res.send();     
};

module.exports ={
    getProducts,
    editProduct,
    deleteProduct,
    addProduct
}