const models = require('../models')

module.exports.findByName = function(name, cb) {
  models.Attack.findOne({where : {name: name}}).then(function(attack) {
    if(err){
      console.log(err)
      cb(err)
    }else{
      cb(attack)
    }
  })
}

module.exports.save = function(attackToAdd) {
  return new Promise((resolve, reject)=>{
    models.Attack[attackToAdd.id === '' ? 'create' : 'update'](attackToAdd, {where: {id: attackToAdd.id}}).then((addedAttack)=>{
      models.Attack.sync().then(()=>{
        resolve(addedAttack)
      })
    })
    .catch((err)=>{
      console.log(err)
      reject(err)
    })
  })
}

module.exports.deleteById = function(attackId) {
  return new Promise((resolve, reject)=>{
    models.Attack.destroy({where: {id: attackId}}).then((count)=>{
      models.Attack.sync().then(()=>{
        resolve(count)
      })
    })
    .catch((err)=>{
      console.log(err)
      reject(err)
    })
  })
}

module.exports.findAll = function(cb) {
  models.Attack.findAll().then(function(attacks){
    cb(attacks)
  })
}


module.exports.translateForDB = (attack)=>{
  let {id, name, description, favorite, inputs, prepare, execute, followup} = attack
  return {
    id: id === 'new' ? '' : id,
    name: name.toLowerCase(),
    description,
    favorite: favorite || '0',
    inputs,
    ...[prepare, execute, followup].reduce((pv, func)=>{
      pv[func.name] = func.function
      pv[`${func.name}_description`] = func.description
      return pv
    },{})
  }
}
