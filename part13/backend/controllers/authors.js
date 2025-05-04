const router = require('express').Router()
const { Blog } = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    group: ['author'],
    attributes: ['author', 
      [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
  })
  res.json(blogs)
})


module.exports = router