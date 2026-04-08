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

module.exports = blogRouter