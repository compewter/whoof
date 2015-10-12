var socket = io();

socket.on('test', function(){
  console.log('received attack: test');
});
