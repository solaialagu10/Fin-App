const jwt = require("jsonwebtoken");
const {User} = require("../models/userModel");
const express =  require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post("/login", async(req,res) =>{
  const {userName, password } =req.body;
  const userWithEmail = await User.find({userName}).catch(
    (err) => {
      console.log("Error:", err);
    }
  )

  if(userWithEmail?.length === 0)
  {
    return res.status(400).json({message:"Email or password does not match!"});
  }
  if(!bcrypt.compareSync(password, userWithEmail[0]?.password)) 
  {
    return res.status(400).json({message:"Incorrect password !"});
  }

  const jwtToken = jwt.sign(
    {userName:userWithEmail[0].userName,id: userWithEmail[0]._id},
    process.env.JWT_SECRET,
  )
 
  res.json({message:"Welcome Back!", token: jwtToken});
});




module.exports =router;