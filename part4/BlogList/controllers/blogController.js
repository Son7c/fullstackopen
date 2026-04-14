const Blog = require("../models/blogs")
const express = require('express');
const User = require("../models/users");
const blogRouter = express.Router()
const jwt=require('jsonwebtoken');

const getTokenFrom=(req)=>{
  const authorization=req.get('authorization');
  if(authorization&&authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ','');
  }
  return null;
}

blogRouter.get('/', async (request, response) => {
  const blogs=await Blog.find({}).populate('user');
  response.json(blogs);
})

blogRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    return response.status(401).json({ error: 'invalid token' })
  }
})

blogRouter.delete('/:id',async(req,res)=>{
  const id=req.params.id;
  const response=await Blog.findByIdAndDelete(id);
  res.status(200).json(response);
})

blogRouter.put('/:id',async(req,res)=>{
  const id=req.params.id;
  const newBlog=req.body;
  const response=await Blog.findByIdAndUpdate(id,newBlog,{ returnDocument: 'after' });
  if (!response) {
    return res.status(404).json({ error: "blog not found" });
  }
  res.status(200).json(response);
})

module.exports = blogRouter