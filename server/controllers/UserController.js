const mongoose = require("mongoose");

const productModel = require("../models/productModel");

const getProducts = async (req, res) => {    
        const products = await productModel.find({});      
        try {
          res.send(products);
        } catch (error) {
          res.status(500).send(error);
        }      
};

const getUserById = async (req, res) => {    
    const user = await productModel.findById(req.params.id);
    try {
      res.send(user);  
    } catch (error) {
      res.status(500).send(error);
    }
};


const addUser = async (req, res) => {    
    const user = new productModel({
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      });
      try {
        await user.save();
        res.send(user);
      } catch (error) {
        res.status(500).send(error);
      }  
};

const addProduct = async (req, res) => {    
  const product = new productModel({
      productName: req.body.productName,
      productId: req.body.productId,
      price: req.body.price,
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

const editUser = async (req, res) => {    
    let myquery = { _id: req.params.id }; 
    let newvalues = {    
        name: req.body.name,
        position: req.body.position,
        level: req.body.level    
    };
    const user = await userModel.findOneAndUpdate(myquery,newvalues,{
      returnOriginal: false
    });
    res.send(user);
};


const deleteProduct = async (req, res) => {  
  console.log("<><><");
    const toDelete = req.body.selected ;
    console.log("<><><"+JSON.stringify(toDelete));
    // let myquery = { _id: req.params.id }
    // var usersDelete = [];
    // var ObjectID = req.mongo.ObjectID;   //req is request from express
    // req.body.forEach(function(item){     //req.body => [{'_id' : ".." , "name" : "john"}]
    //   console.log("<>>>> item"+item._id);
    //   usersDelete.push(ObjectID(item));
    // });
    await productModel.deleteMany({_id:{$in:toDelete}});
    res.send();     
};

module.exports ={
    getProducts,
    getUserById,
    addUser,
    editUser,
    deleteProduct,
    addProduct
}