const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let token = ''

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)

    const testUser = {
        username: 'testuser',
        name: 'Test User',
        password: '12345678'
    }
    
    await api
        .post('/api/users')
        .send(testUser)

    const response = await api
        .post('/api/login')
        .send(testUser)

    token = response.body.token
})

describe('when there is initially some blogs saved', () => {
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
})


describe('addition of a new blog', () => {
    test('adding a blog without a token returns 401', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'New Author',
            url: 'http://newblog.com/',
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const contents = blogsAtEnd.map(b => b.title)
        expect(contents).not.toContain('New Blog')
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog1)
            .expect(400)
        
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(testBlog2)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    const id = '65c5f5fc3659003be4b4ca01'
    const falseId = '65c5f5fc3659003be4b4ca99'
    const malformattedId = '65c5f5fc3659003be4b4ca9'

    test('deleting a blog works', async () => {
        const newBlog = {
            _id: id,
            title: 'New Blog',
            author: 'New Author',
            url: 'http://newblog.com/',
            likes: 0,
            __v: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('deleting a non-existing blog returns 404', async () => {
        await api
            .delete(`/api/blogs/${falseId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })

    test('deleting a blog with a malformatted id returns 400', async () => {
        await api
            .delete(`/api/blogs/${malformattedId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
    })
})

describe('updating a blog', () => {
    const falseId = '65c5f5fc3659003be4b4ca99'
    const malformattedId = '65c5f5fc3659003be4b4ca9'

    test('updating a blog works', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blog = blogsAtStart[0]

        const updatedBlog = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blog.id}`)
            .send(updatedBlog)

        expect(response.body.likes).toBe(blog.likes + 1)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('updating a non-existing blog returns 404', async () => {
        await api
            .put(`/api/blogs/${falseId}`)
            .expect(404)
    })

    test('updating a blog with a malformatted id returns 400', async () => {
        await api
            .put(`/api/blogs/${malformattedId}`)
            .expect(400)
    })
})

describe('adding a user', () => {
    const newUser = {
        name: 'New User',
        username: 'newuser',
        password: '12345678'
    }

    test('adding a new user works', async () => {
        const initialUsers = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(initialUsers.length + 1)

        const contents = usersAtEnd.map(u => u.name)
        expect(contents).toContain(newUser.name)
    })

    test('the username has to be unique', async () => {
        const initialUsers = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(initialUsers.length + 1)
    })

    test('the username must be at least 3 characters', async () => {
        const invalidUser = {
            ...newUser,
            username: 'te'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
    })

    test('the password must be at least 3 characters', async () => {
        const invalidUser = {
            ...newUser,
            password: '12'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})