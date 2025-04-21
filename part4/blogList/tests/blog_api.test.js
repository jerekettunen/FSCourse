const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property is id', async () => {
  const blogs = await api.get('/api/blogs')
  assert.ok(blogs.body[0].id)
  assert.ok(blogs.body[0]._id === undefined)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'Test title',
    author: 'Jere Kettunen',
    url: 'https://dummysite.com/',
    likes: 0,
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('Test title'))
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Likes are not required',
    author: 'Like McLover',
    url: 'https://NoLikesBlog.com/',
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === 'Likes are not required')

  assert.strictEqual(addedBlog.likes, 0)
})

test('a blog without title and url is not added', async () => {
  const newBlogNoTitle = {
    url: 'https://NoTitleBlog.com/',
    likes: 0,
    __v: 0
  }
  const newBlogNoUrl = {
    title: 'No URL',
    likes: 0,
    __v: 0
  }
  const newBlogNoTitleAndUrl = {
    likes: 0,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogNoUrl)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(newBlogNoTitleAndUrl)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
