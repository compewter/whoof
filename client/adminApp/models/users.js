angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  $scope.users = [];
  $scope.selectedUsers = {};

  //request all users when controller loads
  SocketFactory.socket.emit('getUsers', {});

  //request all attacks when controller loads
  SocketFactory.socket.emit('getAttacks', {});

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
    });
  });

  SocketFactory.socket.on('attacks', function(attacks){
    //all attacks are stored in ./attacks.js
    $scope.$apply(function(){
      $scope.attacks = attacks;
    });
  });

  $scope.selectUser = function(userId, userSocketId){
    if($scope.selectedUsers[userId]){
      $scope.selectedUsers[userId] = null;
    }else{
      $scope.selectedUsers[userId] = userSocketId;
    }
  };

  $scope.executeAttack = function(attackName){
    for(var user in $scope.selectedUsers){

      var userSocket = $scope.selectedUsers[user];

      if(!!userSocket){ //verify user is selected
        console.log("Executing attack " + attackName + " on user " + user +":" +userSocket);
        SocketFactory.socket.emit('attackUser', { userSocket: userSocket, attack: attackName });
      }

    }
  };

}]);
