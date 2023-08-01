
const {User} = require("../models/user");
const express =  require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post("/register", async(req,res) =>{   
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const {userName, email} = req.body;

  const alreadyExistUser = await User.find({email}).catch((err)=>{
             console.log("Error :", err);
          })
  if(alreadyExistUser?.length >0)
     return res.json({error:"User with email already exists"});

 const alreadyExistUser2 = await User.find({userName}).catch((err)=>{
      console.log("Error :", err);
   })

   if(alreadyExistUser2?.length >0)
     return res.json({error:"Username already taken"});

  const newUser = new User({userName, email, password:hashedPassword});

  const savedUser =  await newUser.save().catch((err)=>{
    res.json({error : "Cannot register user at the moment"})
  });
  if(savedUser) res.json({message: "Thanks for the registration!"});
});


module.exports =router;