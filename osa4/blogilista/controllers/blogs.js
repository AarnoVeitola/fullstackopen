const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
    const body = request.body
    if (!body.likes) {
        body.likes = 0
    }

    if (!body.title || !body.url) {
        throw new TypeError('Blog title or url is missing!')
    }

    const blog = new Blog(body)
    console.log(body)
    console.log(blog)

    const result = await blog.save()
    response.status(201).json(result)
})

module.exports = blogsRouter