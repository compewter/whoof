var socketio = require('socket.io');
var clientSockets = require('../clientApp/sockets');
var server = require('../server');

module.exports.listen = function(app){
  io = socketio.listen(app);

  io.on('connection', function(socket){
    console.log('admin connected');

    socket.join('admins');

    module.exports.emit = function(eventName, data){
      socket.emit(eventName, data);
    };
    
    socket.on('getUsers', getUsers);

    socket.on('disconnect', disconnect);

    socket.on('attackUser', attackUser);
  });

  return io;
};

var getUsers = function(){
  clientSockets.sendUsers(clientSockets.sockets);
};

var disconnect = function(){
  console.log('admin disconnected');
};

var attackUser = function(data){
  var ioClient = server.ioClient;
  console.log("received instructions to use attack " + data.attack + " on " + data.userSocket);
  ioClient.to(data.userSocket).emit(data.attack, {});
};
