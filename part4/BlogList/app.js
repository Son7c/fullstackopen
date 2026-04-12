require('dotenv').config()
const express = require('express')
const cors = require('cors')
const {MONGODB_URI}=require('./utils/config');

const app = express()
const blogRouter =require('./controllers/blogController')
const userRouter=require('./controllers/userController')

const mongoUrl = MONGODB_URI;
const mongoose = require('mongoose')
mongoose.connect(mongoUrl, { family: 4 })

app.use(cors()) 
app.use(express.json())
app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter);

module.exports=app;

