const blogsRouter = require('express').Router()
const Blog = require('../models/blog')




blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async(request, response) => {
  const user = request.user

  const blog = new Blog(request.body)
  blog.user = user.id

  if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.put('/:id', async(request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    url: body.url,
    likes: body.likes,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


blogsRouter.delete('/:id', async(request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})


module.exports = blogsRouter