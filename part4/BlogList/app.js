require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const blogRouter =require('./controllers/blogController')

const mongoUrl = process.env.MONGODB_URI;
const mongoose = require('mongoose')
mongoose.connect(mongoUrl, { family: 4 })

app.use(cors()) 
app.use(express.json())
app.use('/api/blogs',blogRouter)

module.exports=app;

