
const jwt = require("jsonwebtoken");
const {User} = require("../models/userModel");

const login = async (req, res) => {    
  const {userName, password } =req.body;
  const userWithEmail = await User.find({$or:[{email:userName},{userName}]}).catch(
    (err) => {
      console.log("Error:", err);
    }
  )

  if(userWithEmail?.length === 0)
  {
    console.log("<><><><<< line 16");
    return res.status(400).json({message:"Email or password does not match!"});
  }
  if(userWithEmail[0]?.password !== password)
  {
    console.log(userWithEmail[0].password+"<><><><<< line 18"+password);
    return res.status(400).json({message:"Email or password does not match!"});
  }
  const jwtToken = jwt.sign(
    {id:userWithEmail._id,email: userWithEmail.email},
    process.env.JWT_SECRET
  )
  res.json({message:"Welcome Back!", token: jwtToken});
};

const register = async (req, res) => {    
  
  const {userName, email, password} = req.body;

  const alreadyExistUser = await User.find({email}).catch((err)=>{
             console.log("Error :", err);
          })
  if(alreadyExistUser?.length >0)
     return res.json({error:"User with email already exists"});

  const newUser = new User({userName, email, password});

  const savedUser =  await newUser.save().catch((err)=>{
    res.json({error : "Cannot register user at the moment"})
  });
  if(savedUser) res.json({message: "Thanks for the registration!"});
};


module.exports ={
    login,
    register
}