angular.module('adminConsole', [
  'ngRoute'
])
.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'adminApp/',
    })
    .otherwise('/',{
      templateUrl: 'adminApp/',
    });
});
