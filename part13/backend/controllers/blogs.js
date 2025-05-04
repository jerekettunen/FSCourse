const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog } = require('../models')
const { User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log('authorization', authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log('authorization.substring(7)', authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
      console.log('req.decodedToken', req.decodedToken)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: [ 'name' ]
    }
  })
  res.json(blogs)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (blog) {
    return res.json(blog)
  } else {
    return res.status(404).json({ error: 'Blog not found' })
  }
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id})
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

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }
  if (req.blog.userId !== user.id) {
    return res.status(401).json({ error: 'only the creator can delete this blog' })
  }
  await req.blog.destroy()
  return res.status(204).end()
})



module.exports = router