const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const api = supertest(app)


describe('when there is initially some blogs saved', () => {

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

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
      ...blogToUpdate,
      likes: 100
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogFromDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)

    assert.strictEqual(updatedBlogFromDb.likes, 100)
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[2]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })
})

describe('One user initially in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('MikeyJackson', 15)
    const user = new User({ username: 'Mikey', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'yuuui',
      name: 'Yui Hirasawa',
      password: 'giitah'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })


  test('creation fails with proper status code and message if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Mikey',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'test',
      name: 'Test User',
      password: '12'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('password must be at least 3 characters long'))
  })

  test('creation fails with proper status code and message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 't',
      name: 'Test User',
      password: '12345'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('username must be at least 3 characters long'))
  })

  test('creation fails with proper status code and message if username or password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserNoPass = {
      username: 'Mikey'
    }
    const newUserNoUser = {
      password: 'test'
    }
    const newUserNoPassAndUser = {}

    const result = await api
      .post('/api/users')
      .send(newUserNoPass)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const result2 = await api
      .post('/api/users')
      .send(newUserNoUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const result3 = await api
      .post('/api/users')
      .send(newUserNoPassAndUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    assert(result.body.error.includes('username or password missing'))
    assert(result2.body.error.includes('username or password missing'))
    assert(result3.body.error.includes('username or password missing'))
  })
})



after(async () => {
  await mongoose.connection.close()
})