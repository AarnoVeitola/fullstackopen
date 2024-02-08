const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('checking that all blogs have an id attribute', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('adding a blog works', async () => {
    const newBlog = {
        title: 'New Blog',
        author: 'New Author',
        url: 'http://newblog.com/',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('New Blog')
})

test('likes is initialized to zero if not given', async () => {
    const newBlog = {
        title: 'New Blog',
        author: 'New Author',
        url: 'http://newblog.com/'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)

    expect(response.body.likes).toBe(0)
})

test('response code 400 when adding a blog without title or url', async () => {
    const testBlog1 = {
        author: 'Test author',
        url: 'http://testblog.com/'
    }

    const testBlog2 = {
        title: 'Test blog',
        author: 'Test author'
    }

    await api
        .post('/api/blogs')
        .send(testBlog1)
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send(testBlog2)
        .expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
})