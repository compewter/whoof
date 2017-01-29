const Sequelize = require('sequelize');
const db = require('../')

const Attack = db.define('Attack', {
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

  pathToAttack: {
    type: Sequelize.STRING,
    allowNull: false
  },

  inputs: {
    type: Sequelize.JSON,
    allowNull: true
  },

  followup: { 
    type: Sequelize.INTEGER, 
    references: {
      model: 'Attacks', 
      key: 'id'
    },
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