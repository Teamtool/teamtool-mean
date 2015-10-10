'use strict';

angular.module('teamtoolApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {'title': 'Ideas', 'link': '/idea'}
    ];

    $scope.currentUser = Auth.getCurrentUser();

    $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
    };

    $scope.isAdmin = function() {
      return Auth.isAdmin();
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
