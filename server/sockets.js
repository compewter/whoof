var sockets = [];

module.exports.connection = function(socket){
  sockets.push(socket);
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
};

module.exports.sockets = sockets;
