'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, $filter,  socket, Auth) {
    $scope.awesomeIdeas = [];
    $scope.ratings = [];

    $scope.isAdmin = Auth.isAdmin;

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
      var ideas_rating =  $filter('filter')($scope.ratings, {idea:idea._id});
      for (var i = 0; i < ideas_rating.length; i++){
        sum += parseInt(ideas_rating[i].star_rating, 10); //don't forget to add the base
      }

      if (ideas_rating.length > 0)
        return (sum / ideas_rating.length).toFixed(1);
      else
        return 0;

    };

    $scope.getStarSum = function(idea) {
      var sum = 0;
      var ideas_rating =  $filter('filter')($scope.ratings, {idea:idea._id});
      for (var i = 0; i < ideas_rating.length; i++){
        sum += parseInt(ideas_rating[i].star_rating, 10); //don't forget to add the base
      }
      return sum;
    };

    $scope.getVotes = function(idea) {
      var no_ratings =  $filter('filter')($scope.ratings, {idea:idea._id});
      return no_ratings.length;
    };


    $scope.addRating = function(idea) {
      var my_rating =  $filter('filter')($scope.ratings, {idea:idea._id, author: Auth.getCurrentUser()._id});
      if (my_rating.length == 0 && idea.rating > 0 )
      {
        $http.post('/api/ratings', { star_rating: idea.rating, idea: idea._id, author: Auth.getCurrentUser()._id } );
      }

    };

    $scope.hoverIn = function(){
      this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
      this.hoverEdit = false;
    };


  });
