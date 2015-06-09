'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, socket) {
    $scope.awesomeIdeas = [];

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $scope.addIdea = function() {
      if($scope.newIdea === '') {
        return;
      }
      $http.post('/api/ideas', { name: $scope.newIdea });
      $scope.newIdea = '';
    };

    $scope.deleteIdea = function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('idea');
    });

  });
