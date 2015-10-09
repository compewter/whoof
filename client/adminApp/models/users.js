angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  $scope.users = [
    {
      id: 0,
      ip: '127.0.0.1'
    }
  ];

  SocketFactory.socket.on('newUser', function(data){
    $scope.$apply(function(){
      $scope.users.push(data);
    })
  });

}]);
