'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomeIdeas = [];
    $scope.ratings = [];

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $http.get('/api/ratings').success(function(ratings) {
      $scope.ratings = ratings;
      socket.syncUpdates('rating', $scope.ratings);
    });

    $scope.addIdea = function() {
      if($scope.idea.title === '') {
        return;
      }
      $http.post('/api/ideas', { name: $scope.idea.title , description: $scope.idea.description, author: Auth.getCurrentUser()._id});
      $scope.idea.title = '';
      $scope.idea.description = '';
    };

    $scope.deleteIdea = function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('idea');
      socket.unsyncUpdates('rating');
    });

    $scope.getStarAverage = function(idea) {
      var sum = 0;
      var MyData = [1, 2 ,3, 4, 5, 6];
      for (var i = 0; i < MyData.length; i++){
        sum += parseInt(MyData[i], 10); //don't forget to add the base
      }
      var avg = sum / MyData.length;
      return avg;

    };

    $scope.getVotes = function(idea) {
      var votes = 0;
      var rats = $scope.ratings;
      for (var i = 0; i < rats.length; i++){
        if(rats[i].idea == idea._id){
          votes++;
        }
      }
      return votes;
    };


    $scope.addRating = function(idea) {
      $http.post('/api/ratings', { star_rating: idea.rating, idea: idea._id } );
    };


  });
