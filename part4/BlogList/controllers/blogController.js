const { response } = require("../app")
const Blog = require("../models/blogs")
const express = require('express')
const blogRouter = express.Router()

blogRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response) => {
  const{title,url}=request.body;
  if(!title||!url){
    return response.status(400).json({ error: "title and url required" });
  }
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result)
  })
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