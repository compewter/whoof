var socketio = require('socket.io');
var clientSockets = require('../clientApp/sockets');

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
  });

  return io;
};

var getUsers = function(){
  clientSockets.sendUsers(clientSockets.sockets);
};

var disconnect = function(){
  console.log('admin disconnected');
}
