angular.module('adminConsole.users', [])

.controller('UserController', ['$scope', 'SocketFactory', function ($scope, SocketFactory) {

  //contains all connected users
  $scope.users = [];

  //contains user:socketId mapping
  $scope.selectedUsers = {};

  //contains results from executed commands
  $scope.results = [];

  //request all users when controller loads
  SocketFactory.socket.emit('getUsers', {});

  SocketFactory.socket.on('newUser', function(user){
    $scope.$apply(function(){
      $scope.users.push(user);
    });
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

  $scope.selectUser = function(userId, userSocketId){
    if($scope.selectedUsers[userId]){
      $scope.selectedUsers[userId] = null;
    }else{
      $scope.selectedUsers[userId] = userSocketId;
    }
  };

  //request all attacks when controller loads
  SocketFactory.socket.emit('getAttacks', {});

  SocketFactory.socket.on('attacks', function(attacks){
    //all attacks are stored in ./attacks.js
    $scope.$apply(function(){
      $scope.attacks = attacks;
    });
  });

  $scope.executeAttack = function(attackName, inputs, followup, victim){
  
    var victimSockets = {};
    var userSocket;
    
    if (victim !== undefined){//specific victim is specified in followup attacks
      userSocket = $scope.selectedUsers[victim];
      victimSockets[victim] = userSocket;
    }else{
      for(var user in $scope.selectedUsers){
        userSocket = $scope.selectedUsers[user];

        if(!!userSocket){ //verify user is selected
          victimSockets[user] = userSocket;
        }
      }
    }

    for(var user in victimSockets){
      $scope.results.push({
        message: "Executing attack " + attackName + " on user " + user,
        successful: true,
        timestamp: new Date()
      });
      SocketFactory.socket.emit('attackUser', { 
        userSocket: victimSockets[user], 
        attack: attackName,
        inputs: inputs,
        followup: followup
      });
    }
  };

  SocketFactory.socket.on('result', function(result){

    result.message = result.status + " on user " + result.id;
    result.timestamp = new Date();

    if(result.followup){
      findAttackByName(result.name, function(ind){
        //doing this results in the generic inputs being bound to the result.inputs
        //result.inputs = $scope.attacks[ind].followup.inputs;

        //add inputs to result object
        result.inputs = {};
        for( var input in $scope.attacks[ind].followup.inputs ){
          result.inputs[input] = $scope.attacks[ind].followup.inputs[input] || '';
        } 
      });
    }

    if(!result.results.successful){
      result.message += " : " + JSON.stringify(result.err);
    }

    $scope.$apply(function(){
      $scope.results.push(result);
    });
    
  });

  var findAttackByName = function(name, cb){
    for(var i = 0; i < $scope.attacks.length; i++){
      if($scope.attacks[i].name === name){
        cb(i);
        return;
      }
    }

    cb(-1);
  };

}]);
