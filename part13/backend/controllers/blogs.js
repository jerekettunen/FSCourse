const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (blog) {
    return res.json(blog)
  } else {
    return res.status(404).json({ error: 'Blog not found' })
  }
})

router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    return res.json(blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    return res.json(req.blog.likes)
  }
  return res.status(404).json({ error: 'Blog not found' })
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy()
    return res.status(204).end()
  }
  return res.status(404).json({ error: 'Blog not found' })
})



module.exports = router