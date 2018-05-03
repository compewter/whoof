const Sequelize = require('sequelize');
const sequelize = require('../')

const Attack = sequelize.define('Attack', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },

  favorite: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false
  },

  prepare: {
    type: Sequelize.STRING,
    allowNull: false
  },

  execute: {
    type: Sequelize.STRING,
    allowNull: false
  },

  followup: {
    type: Sequelize.STRING,
    allowNull: false
  },

  prepare_description: {
    type: Sequelize.STRING,
    allowNull: false
  },

  execute_description: {
    type: Sequelize.STRING,
    allowNull: false
  },

  followup_description: {
    type: Sequelize.STRING,
    allowNull: false
  },

  inputs: {
    type: Sequelize.JSON,
    allowNull: true
  }
});

Attack.sync();

module.exports = Attack;
