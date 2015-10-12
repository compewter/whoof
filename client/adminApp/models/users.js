angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  $scope.users = [];
  $scope.selectedUsers = {};
  $scope.attacks = [
    {
      id: 0,
      name: "test",
      description: "lorem ipsum yadda yadda",
      socketEvent: 'test'
    },
    {
      id: 1,
      name: "attack2",
      description: "lorem ipsum yadda yadda",
      socketEvent: 'attack2'
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


  $scope.selectUser = function(userId, userSocketId){
    if($scope.selectedUsers[userId]){
      $scope.selectedUsers[userId] = null;
    }else{
      $scope.selectedUsers[userId] = userSocketId;
    }
  };

  $scope.executeAttack = function(attackId){

    for(var user in $scope.selectedUsers){
      var userSocket = $scope.selectedUsers[user];
      if(!!userSocket){
        console.log("Executing attack " + $scope.attacks[attackId].name + " on user " + user +":" +userSocket);
        var attackEvent = $scope.attacks[attackId].socketEvent;
        SocketFactory.socket.emit('attackUser', { userSocket: userSocket, attack: attackEvent });
      }
    }

  };
}]);
