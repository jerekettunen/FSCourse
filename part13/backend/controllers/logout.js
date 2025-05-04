const {User, Session} = require('../models')
const router = require('express').Router()


router.delete('/', async (request, response) => {
  console.log('request.body', request.body)
  const { username } = request.body; // Extract username from request body

  if (!username) {
    return response.status(400).json({ error: 'username is required' });
  }
  
  const user = await User.findOne({
    where: {
      username: username
    }
  })
  if (!user) {
    return response.status(401).json({
      error: 'invalid username'
    })
  }
  user.active = false
  await user.save()
  const session = await Session.findOne({
    where: {
      userId: user.id
    }
  })
  if (session) {
    await session.destroy()
    return response.status(204).end()
    }


  return response.status(200).json({
  message: 'User logged out, but no active session found'
  })
})

module.exports = router