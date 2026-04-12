const bcrypt = require('bcrypt');
const saltRounds = 10;
const User=require("../models/users");
const express = require('express')
const userRouter = express.Router()

userRouter.post("/",async(req,res)=>{
    const{username,password,name}=req.body;
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
    const users=await User.find({});
    res.status(200).json(users);
})

module.exports=userRouter;