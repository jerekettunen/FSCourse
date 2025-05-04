require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
})

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})
Blog.sync()

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.get('/api/blogs/:id', async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.findByPk(id)
    if (blog) {
      return res.json(blog)
    } else {
      return res.status(404).json({ error: 'Blog not found' })
    }
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.post('/api/blogs', async (req, res) => {
  console.log('req.body', req.body)
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params
  try {
    const blog = await Blog.destroy({ where: { id } })
    if (blog) {
      return res.status(204).end()
    } else {
      return res.status(404).json({ error: 'Blog not found' })
    }
  } catch(error) {
    return res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})