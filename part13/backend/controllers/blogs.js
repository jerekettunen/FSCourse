const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog } = require('../models')
const { User } = require('../models')
const { Op } = require('sequelize')

const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}



router.get('/', async (req, res) => {
 
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: [ 'name' ]
    },
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { author: { [Op.iLike]: `%${search}%` } },
      ]
    },
    order: [['likes', 'DESC']]
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
    if (user.active === false) {
      return res.status(401).json({ error: 'user is not logged in' })
    }
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
  if (user.active === false) {
    return res.status(401).json({ error: 'user is not logged in' })
  }
  await req.blog.destroy()
  return res.status(204).end()
})



module.exports = router