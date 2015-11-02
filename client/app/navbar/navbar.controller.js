'use strict';

angular.module('teamtoolApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      {'title': 'Ideas', 'link': '/idea'},
      {'title': 'Training Catalog', 'link': '/training_cards'},
      {'title': 'Question/Answers', 'link': '/question_answer'}

    ];

    $scope.currentUser = function() {
      return Auth.getCurrentUser();
    };

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
