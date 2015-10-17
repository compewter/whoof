var socketio = require('socket.io')
var adminSocket = require('../adminApp/sockets');
var fs = require('fs');

var sockets = [];
//id for sockets which we increment. This should eventually be stored in a database
var id = 0;

module.exports.listen = function(app){

  io = socketio.listen(app);

  io.on('connection', function(socket){
    
    console.log('a user connected');

    //store the id number of the socket on it in a new property
    socket._id = id++;

    socket.join('users');
    
    //on new user connection, send info to admin
    var newUser = buildNewUser(socket);
    adminSocket.emit('newUser', newUser);

    sockets.push(newUser);

    socket.on('result', result);

    //when user disconnects, let admin know
    socket.on('disconnect', function(){
      disconnect(socket);
    });

  });

  return io;
};

var buildNewUser = function(socket){

  var clientIp = socket.handshake.address;
  var clientAgent = socket.handshake.headers['user-agent'];
  
  return {
    id: socket._id,
    socketId: socket.id,
    //address is in the form ::ffff:000.000.000.000
    ip: clientIp.slice(clientIp.lastIndexOf(':') + 1),
    agent: clientAgent.slice(clientAgent.indexOf('(') + 1,clientAgent.indexOf(')')),
    connectedAt: new Date(socket.handshake.time)
  };
};

var disconnect = function(socket){
  adminSocket.emit('userLeft', {
    id: socket._id
  });

  //remove socket from active sockets array
  for(var i = 0; i < sockets.length; i++){
    if(sockets[i].id === socket._id){
      sockets.splice(i,1);
    }
  };
};

var result = function(result){
  adminSocket.emit('result', result);
};

module.exports.sockets = sockets;
  
//exporting this so that it can be called from adminApp/sockets
module.exports.sendUsers = function(users){
  users.forEach(function(user){
    adminSocket.emit('newUser', user);
  });
};
