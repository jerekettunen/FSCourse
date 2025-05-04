require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

console.log('DATABASE_URL', process.env.DATABASE_URL)

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    console.log(blogs)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()