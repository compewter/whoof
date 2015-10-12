angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  $scope.users = [];
  $scope.selectedUsers = {};
  $scope.attacks = [
    {
      id: 0,
      name: "test",
      description: "lorem ipsum yadda yadda"
    },
    {
      id: 1,
      name: "test2",
      description: "lorem ipsum yadda yadda"
    }
  ];

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

  $scope.selectUser = function(userId){
    if($scope.selectedUsers[userId]){
      $scope.selectedUsers[userId] = false;
    }else{
      $scope.selectedUsers[userId] = true;
    }
  };

  $scope.executeAttack = function(attackId){
    console.log("Executing attack " + $scope.attacks[attackId].name + " on " + JSON.stringify($scope.selectedUsers));
  };
}]);
