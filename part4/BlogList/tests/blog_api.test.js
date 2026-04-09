const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
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

test('Get Request',async()=>{
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('all blogs are returned',async()=>{
    const res=await api.get('/api/blogs');
    assert.strictEqual(res.body.length,initialBlogs.length)
})

test('unique identifier property of the blog posts is named id',async()=>{
    const res=await api.get('/api/blogs');
    const blogToCheck=res.body[0];
    assert.ok(blogToCheck);
    assert.strictEqual(blogToCheck._id,undefined);
})

describe('Testing the Creation of new Post',()=>{
    const newBlog ={
        title: "Mastering DSA Step by Step",
        author: "Souvik Majee",
        url: "https://myblog.com/dsa-guide",
        likes: 0,
    };
    test('Creating a new Blog',async()=>{
        const res=await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        assert.strictEqual(res.body.title,newBlog.title);
        assert.strictEqual(res.body.author,newBlog.author);
        assert.strictEqual(res.body.url,newBlog.url);
        assert.strictEqual(res.body.likes,newBlog.likes);
    })
    
})

test('Likes property missing, default to 0',async()=>{
    const dummyBlog={
        title: "NO likes",
        author: "Souvik Majee",
        url: "https://myblog.com/dsa-guide/nolikes",
    };
    const res=await api
        .post('/api/blogs')
        .send(dummyBlog)
        .expect(201)
        .expect('Content-Type',/application\/json/)
        assert.strictEqual(res.body.likes,0);
})

test('MIssing title or url checking',async()=>{
    const blog={
        "url": "NOne",
        "likes": 5
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
})
test('Deleting a blog',async()=>{
    const id="69d6a5869bf51fbcebbf739f";
    await api
        .delete(`/api/blogs/${id}`)
        .expect(200)
        .expect('Content-Type',/application\/json/)
})

test.only('Updating a blog',async()=>{
    const blogs=await api.get('/api/blogs');
    const blogToUPdate=blogs.body[0];

    const updatedBlog={
        ...blogToUPdate,
        likes:100
    }
    const id=blogToUPdate.id;
    const res=await api
        .put(`/api/blogs/${id}`)
        .send(updatedBlog)
        .expect(200)
    assert.strictEqual(res.body.likes,updatedBlog.likes);  
})

after(async()=>{
    mongoose.connection.close();
})