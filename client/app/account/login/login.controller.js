'use strict';

angular.module('teamtoolApp')
  .controller('LoginCtrl', function ($rootScope, $scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          if(typeof $rootScope.originalUrl != 'undefined') {
            $location.path($rootScope.originalUrl);
            delete $rootScope.originalUrl;
          } else {
            // Logged in, redirect to ideas
            $location.path('/');
          }
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
