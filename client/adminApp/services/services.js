angular.module('adminConsole.services', [])

.factory('SocketFactory', function(){
  
  var socket = io();

  return{
    socket: socket
  }

});
