const express = require('express')

const app = express()
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingsRouter = require('./controllers/readinglist')
const logoutRouter = require('./controllers/logout')
const middleware = require('./util/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglist', readingsRouter)
app.use('/api/logout', logoutRouter)

const start = async () => {
  console.log('Connecting to database...')
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

start()