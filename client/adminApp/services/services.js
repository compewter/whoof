angular.module('adminConsole.services', [])

.factory('Users', function ($http) {

  var fetch = function(){
    return $http({
      method:'GET',
      url: "/users"
    });
  };
  
  return {
    fetch: fetch
  };

})

.factory('SocketFactory', function(){
  
  var socket = io();

  return{
    socket: socket
  }

});
