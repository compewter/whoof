const Sequelize = require('sequelize')

const db = new Sequelize('whoof', null, null, {
  dialect: 'sqlite',
  storage: './db/db.sqlite3'
})

module.exports = db