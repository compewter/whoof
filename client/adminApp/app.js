angular.module('adminConsole', [
  'adminConsole.users',
  'adminConsole.services',
  'ngRoute',
  'angularMoment'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/users.html',
    })
    .otherwise('/',{
      templateUrl: 'views/users.html',
    });
});
