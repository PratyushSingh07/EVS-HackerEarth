const express=require('express')
require("dotenv").config();
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


router.post('/login',[
  body('email').isEmail(),
  body('password','Password cannot be blank').exists()
],async (req,res)=>{
  const errors = validationResult(req);
  var success=false
   if (!errors.isEmpty()) {
     return res.status(400).json({success:success, errors: errors.array()});
   }
  const {email,password}=req.body;
  try {
    let user=await User.findOne({email:req.body.email})//mongoDB
    // console.log(user);
    if(!user){
      return res.status(400).json({success:success, errors: "Wrong credentials" });
    }
    const passCompare=await bcrypt.compare(password,user.password);
    if(!passCompare)
    return res.status(400).json({success:success, errors: "Wrong credentials" });
    const data={
      user:{
        id:user.id
      }
    }
    var authToken = jwt.sign(data, process.env.SECRET_KEY);
    success=true
    res.json({success,authToken})
  } catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
})


router.post('/signup',[
   body('name').isLength({ min: 3 }), 
   body('email').isEmail(),
   body('password').isLength({ min: 5 }),
   body('phone_no').isLength({ min: 10, max:11}),
   body('age').isNumeric(),
   body('address').isLength({ min: 3 }),
   body('gender').exists()
],
async(req,res)=>{
   const errors = validationResult(req);
   var success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success:success, errors: errors.array() });
    }
    let user=await User.findOne({email:req.body.email})
    // console.log(user);
    if(user){
      return res.status(400).json({success:success, errors: "Email already exists" });
    }
    var salt =await bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    try{
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password:hash,
      phone_no:req.body.phone_no,
      age:req.body.age,
      address:req.body.address,
      gender:req.body.gender,
    });
    const data={
      user:{
        id:user.id
      }
    }
    var authToken = jwt.sign(data, process.env.SECRET_KEY);
    success=true;
    res.json({success,authToken})
  }
  catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
})

router.post('/login',[
  body('email').isEmail(),
  body('password','Password cannot be blank').exists()
],async(req,res)=>{
  try{
    userId="todo"
    const user=await User.findById(userId).select("-password")
  }catch(error){
    console.log(error.message);
    res.status(500).send("Internal Server Error")
  }
})

module.exports=router