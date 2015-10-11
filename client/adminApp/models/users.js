angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  $scope.users = [];

  //request all users when controller loads
  SocketFactory.socket.emit('getUsers',{});

  SocketFactory.socket.on('newUser', function(user){
    $scope.$apply(function(){
      $scope.users.push(user);
    })
  });

  SocketFactory.socket.on('userLeft', function(user){
    //remove user that left from $scope.users
    $scope.$apply(function(){
      for(var i = 0; i < $scope.users.length; i++){
        if($scope.users[i].id === user.id){
          $scope.users.splice(i,1);
        }
      }
    })
  });

}]);
