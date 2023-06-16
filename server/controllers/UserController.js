const mongoose = require("mongoose");

const userModel = require("../models");

const getUsers = async (req, res) => {    
        console.log("Getting users from controller");
        const users = await userModel.find({});      
        try {
          res.send(users);
        } catch (error) {
          res.status(500).send(error);
        }      
};

const getUserById = async (req, res) => {    
    console.log("Getting user from controller");
    const user = await userModel.findById(req.params.id);
    try {
      res.send(user);  
    } catch (error) {
      res.status(500).send(error);
    }
};


const addUser = async (req, res) => {    
    const user = new userModel({
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


const deleteUser = async (req, res) => {    
    console.log("Delete a record "+JSON.stringify(req.body));
    let myquery = { _id: req.params.id }
    await userModel.findOneAndRemove(myquery,req.body);
    res.send();     
};

module.exports ={
    getUsers,
    getUserById,
    addUser,
    editUser,
    deleteUser
}