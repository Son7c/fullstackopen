const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User=require('../models/users');

describe('Testing user creation',()=>{
    beforeEach(async () => {
        await User.deleteMany({});
        const initialUser = new User({
            username: "Son7ctest69",
            passwordHash: "dummyhash",
            name: "Initial User"
        });
        await initialUser.save();
    })
    test.only('creation succeeds with a fresh, valid username and password',async()=>{
        const usersAtStart=await User.find({});
        const user={
            username:"Son7ctest6",
            password:"3344",
            name:"Souvik majee"
        }
        await api
            .post("/api/users")
            .send(user)
            .expect(201)
            .expect('Content-Type',/application\/json/)

        const usersAtEnd=await User.find({});
        assert.strictEqual(usersAtEnd.length,usersAtStart.length+1);
        
        const usernames=usersAtEnd.map(u=>u.username);
        assert.ok(usernames.includes(user.username));
    })
    test.only('creation fails with proper statuscode and message if username is already taken',async()=>{
        const usersAtStart=await User.find({});
        const user={
            username:"Son7ctest69",
            password:"1234",
            name:"Souvik"
        }
        const response=await api
            .post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-Type',/application\/json/)

        assert.ok(response.body.error.includes('User already exists'));
        const usersAtEnd=await User.find({});
        assert.strictEqual(usersAtEnd.length,usersAtStart.length);
    })
    test.only('creation fails with password and username less than 3 characters',async()=>{
        const usersAtStart=await User.find({});
        const newUser={
            username:"a",
            password:"b",
            name:"Souvik"
        }
        const response=await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type',/application\/json/)
        assert.ok(response.body.error);
        const usersAtEnd=await User.find({});
        assert.strictEqual(usersAtStart.length,usersAtEnd.length);
    })
})

after(async () => {
    await mongoose.connection.close()
})