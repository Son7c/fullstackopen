const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog=require('../models/blogs');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

beforeEach(async()=>{
    await Blog.deleteMany({});

    let blogObject=new Blog(initialBlogs[0]);
    await blogObject.save();

    blogObject=new Blog(initialBlogs[1]);
    await blogObject.save();
})

test.only('Get Request',async()=>{
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test.only('all blogs are returned',async()=>{
    const res=await api.get('/api/blogs');
    assert.strictEqual(res.body.length,initialBlogs.length)
})

test.only('unique identifier property of the blog posts is named id',async()=>{
    const res=await api.get('/api/blogs');
    const blogToCheck=res.body[0];
    assert.ok(blogToCheck);
    assert.strictEqual(blogToCheck._id,undefined);
})

after(async()=>{
    mongoose.connection.close();
})