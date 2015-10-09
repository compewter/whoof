var socketio = require('socket.io');

module.exports.listen = function(app){
  io = socketio.listen(app);

  io.on('connection', function(socket){
    console.log('admin connected');

    module.exports.emit = function(eventName, data){
      socket.emit(eventName, data);
    };
    
    socket.on('disconnect', function(){
      console.log('admin disconnected');
    });
  });

  return io;
};
