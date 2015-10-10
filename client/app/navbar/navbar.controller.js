'use strict';

angular.module('teamtoolApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {'title': 'Ideas', 'link': '/idea'}
    ];

    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.isAdmin = Auth.isAdmin();
    $scope.currentUser = Auth.getCurrentUser();

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
