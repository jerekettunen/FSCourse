const router = require('express').Router()
const { Readings } = require('../models')
const sequelize = require('sequelize')

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body
  console.log('blogId', blogId)
  console.log('userId', userId)
  const reading = await Readings.create(req.body)
  return res.json(reading)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const reading = await Readings.findByPk(id)
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' })
  }
  reading.read = req.body.read
  await reading.save()
  return res.json(reading)
})

module.exports = router