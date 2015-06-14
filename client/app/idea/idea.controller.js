'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeIdeas = [];

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $scope.addIdea = function() {
      if($scope.title === '') {
        return;
      }
      $http.post('/api/ideas', { name: $scope.title , description: $scope.description, createdBy: Auth.getCurrentUser()._id});
      $scope.title = '';
      $scope.description = '';
    };

    $scope.deleteIdea = function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('idea');
    });

  });
