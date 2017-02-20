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

// Attack.sync({force: true}).then(function(){
//  Attack.create({
//    name: "test",
//    description: "Sample attack module",
//    pathToAttack: "attacks/test.js",
//    inputs: {
//       input1: 'default value',
//       input2: '',
//       input3: ''
//     },
//      followup: 1
//  });
// });

module.exports = Attack;