var socketio = require('socket.io')
var adminSocket = require('../adminApp/sockets');
var sockets = [];
var fs = require('fs');

module.exports.listen = function(app){

  io = socketio.listen(app);

  io.on('connection', function(socket){
    sockets.push(socket);

    adminSocket.emit('newUser', {
      id: 1,
      ip: '123.234.123.234'
    });

    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });

  return io;
};

module.exports.sockets = sockets;
