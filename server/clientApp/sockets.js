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
    
    var newUser = buildNewUser(socket);
    adminSocket.emit('newUser', newUser);

    socket.on('disconnect', function(){
      adminSocket.emit('userLeft', {
        id: socket._id
      });
    });

  });

  return io;
};

var buildNewUser = function(socket){

  var clientIp = socket.handshake.address;
  var clientAgent = socket.handshake.headers['user-agent'];
  
  return {
    id: socket._id,
    //address is in the form ::ffff:000.000.000.000
    ip: clientIp.slice(clientIp.lastIndexOf(':') + 1),
    agent: clientAgent.slice(clientAgent.indexOf('(') + 1,clientAgent.indexOf(')')),
    connectedAt: socket.handshake.time
  };
};
