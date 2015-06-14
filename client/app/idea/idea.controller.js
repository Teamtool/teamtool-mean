'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeIdeas = [];
    $scope.idea = {};

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $scope.addIdea = function() {
      if($scope.idea.title === '') {
        return;
      }
      $http.post('/api/ideas', { name: $scope.idea.title , description: $scope.idea.description, createdBy: Auth.getCurrentUser()._id});
      $scope.idea.title = '';
      $scope.idea.description = '';
    };

    $scope.deleteIdea = function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('idea');
    });

  });
