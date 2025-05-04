const Blog = require('./blog')
const User = require('./user')
const Readings = require('./readings')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readings, as: 'user_list' })
User.belongsToMany(Blog, { through: Readings, as: 'reading_list' })

User.hasOne(Session)

module.exports = {
  Blog,
  User,
  Readings,
  Session
}