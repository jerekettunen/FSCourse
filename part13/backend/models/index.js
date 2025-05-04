const Blog = require('./blog')
const User = require('./user')
const Readings = require('./readings')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readings, as: 'user_list' })
User.belongsToMany(Blog, { through: Readings, as: 'reading_list' })

module.exports = {
  Blog,
  User,
  Readings
}