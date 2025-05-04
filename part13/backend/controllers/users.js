const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User } = require('../models')
const { Blog } = require('../models')
const { Op } = require('sequelize')


router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [{
      model: Blog,
      attributes: { exclude: ['userId'] }
    },
    ],
    attributes: { exclude: ['password'] },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
      return response.status(400).json({ error: 'username or password missing' })
    }
    if (password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }
  const saltRounds = 15
  const passwordHash = await bcrypt.hash(password, saltRounds) 
  console.log('passwordHash', passwordHash)
  const user = await User.create({
    ...req.body,
    password: passwordHash
  })
    res.json(user)
})

router.get('/:id', async (req, res) => {
  let readCondition = {}; // Default: no filtering
  if (req.query.read !== undefined) {
    readCondition = { read: req.query.read }; // Filter by 'read' if provided
  }
  const user = await User.findByPk(req.params.id, {
    include: [{
      model: Blog,
      as: 'reading_list',
      through: {
        attributes: ['id', 'read'],
        where: readCondition,
      },
      attributes: { exclude: ['userId'] }
    },
    ],
    attributes: { exclude: ['password'] },
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  console.log('req.params.username', req.params.username)
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  console.log('user', user)
  if (user) {
    user.username = req.body.username
    await user.save()
    return res.json(user)
  }
  else {
    return res.status(404).json({ error: 'Blog not found' })
  }
})



module.exports = router