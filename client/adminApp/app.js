angular.module('adminConsole', [
  'adminConsole.users',
  'adminConsole.services',
  'ngRoute',
  'yaru22.angular-timeago'
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
