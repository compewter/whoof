const models = require('../models');

module.exports.findByName = function(name, cb) {
  models.Attack.findOne({where : {name: name}}).then(function(attack) {
    console.log("found", attack);
    if(err){
      console.log(err);
      cb(err);
    }else{
      cb(attack);
    }
  });
};

module.exports.add = function(newAttackOptions, cb) {
  models.Attack.create(newAttackOptions).then(function(newAttack){
    if(err){
      console.log(err);
      cb(err);
    }else{
      cb(newAttack);
    }
  });
};

module.exports.findAll = function(cb) {
  models.Attack.findAll().then(function(attacks){
    cb(attacks);
  });
};