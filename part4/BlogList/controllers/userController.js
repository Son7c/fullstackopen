const bcrypt = require('bcrypt');
const saltRounds = 10;
const User=require("../models/users");
const express = require('express')
const userRouter = express.Router()

userRouter.post("/",async(req,res)=>{
    const{username,password,name}=req.body;
    if(!username&&!password){
        return res.status(400).json({error:"Username and password is required"});
    }
    if(username.length<3&&password.length<3){
        return res.status(400).json({error:"Username and password both must be 3 characters long"});
    }
    const existingUser=await User.findOne({username:username});
    if(existingUser){
        return res.status(400).json({error:"User already exists"});
    }
    const hash=await bcrypt.hash(password, saltRounds)
    const user=new User({
        username:username,
        passwordHash:hash,
        name:name
    });
    const savedUser=await user.save();
    return res.status(201).json(savedUser);
})

userRouter.get('/',async(req,res)=>{
    const users=await User.find({}).populate('blogs');
    res.status(200).json(users);
})

module.exports=userRouter;