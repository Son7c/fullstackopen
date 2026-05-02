const Blog = require("../models/blogs");
const express = require("express");
const User = require("../models/users");
const blogRouter = express.Router();
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user");
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  try {
    const body = request.body;
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    if (!body.title || !body.url) {
      return response.status(400).json({ error: "title and url required" });
    }

    const blog = new Blog({
      ...request.body,
      user: user._id,
    });

    const savedBlog = await blog.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { blogs: savedBlog._id }
    });
    response.status(201).json(savedBlog);
  } catch (error) {
    return response.status(401).json({ error: "invalid token" });
  }
});

blogRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Token missing or invalid" });
    }
    if (req.user.id.toString() === blog.user.toString()) {
      await Blog.findByIdAndDelete(id);
      return res.status(204).end();
    } else {
      return res
        .status(403)
        .json({ error: "Only the creator can delete this blog" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Token invalid" });
  }
});

blogRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { title, author, url, likes } = req.body;
  try {
    const newBlog = {
      title,
      author,
      url,
      likes,
    };
    const response = await Blog.findByIdAndUpdate(id, newBlog, {
      returnDocument: "after",
    }).populate("user");
    if (!response) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: "malformatted id or data" });
  }
});

blogRouter.get("/my-blogs", async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "Token missing or invalid" });
    }
    const myBlogs = await Blog.find({ user: user._id }).populate("user");
    res.send(myBlogs);
  } catch (err) {
    res.status(404).json({ error: "No data found" });
  }
});

module.exports = blogRouter;
