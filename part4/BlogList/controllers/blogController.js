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
  const response=await Blog.findByIdAndDelete({_id:id});
  res.status(200).json(response);
})

module.exports = blogRouter