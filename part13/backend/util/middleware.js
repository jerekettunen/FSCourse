const jwt = require('jsonwebtoken')
const { Session } = require('../models')


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors[0].message })
  }else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.errors[0].message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Invalid data type or database error' })
  }
  
  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    try {
      req.decodedToken = jwt.verify(token, process.env.SECRET)
      console.log('token is valid')
      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'session is invalid' })
      }
      console.log(session)
      console.log('req.decodedToken.id', req.decodedToken.id)
      if (session.userId !== req.decodedToken.id) {
        return res.status(401).json({ error: 'session is invalid' })
      }
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}