'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, $filter, $modal, socket, Auth, Modal) {

    /*
    Constants
     */

    $scope.awesomeIdeas = [];
    $scope.ratings = [];

    $scope.states = [
      { value:'Open' },
      { value:'Accepted' },
      { value:'In Progress' },
      { value:'Implemented' },
      { value:'Rejected' }
    ];

    $scope.categoryMap = {
      'Ideas Backlog' : 'dodgerblue',
      'Training Catalog' : 'limegreen',
      'User Settings' : 'orange',
      'Login/Logout' : 'orchid',
      'Other' : 'darkred'
    };

    $scope.categories = Object.keys($scope.categoryMap);

    /*
     Scope Api calls
     */

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $http.get('/api/ratings').success(function(ratings) {
      $scope.ratings = ratings;
      socket.syncUpdates('rating', $scope.ratings);
    });


    /*
    Util functions
     */

    $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
    };


    /*
    For View
     */

    $scope.sortCriterion = "date";
    $scope.sortCriterionLabel = "date (newest first) ";
    $scope.sortReverse = false;

    $scope.getSortCriterion = function(idea) {
      return '-' + $scope.sortCriterion;
    };

    $scope.isCollapsed = true;

    $scope.$watch('isCollapsed', function(){
      $scope.ideaFormToggleText = $scope.isCollapsed ? 'Create Idea' : 'Close Form';
    });

    $scope.allowedToRate = function(idea) {
      var my_ratings =  $filter('filter')($scope.ratings, {idea:idea._id, author: Auth.getCurrentUser()._id});
      if (my_ratings.length == 0 && idea.author._id != Auth.getCurrentUser()._id && idea.state == $scope.states[0].value)
        return true;
      else
        return false;
    };

    $scope.allowedToDelete = function(idea) {
      if (Auth.getCurrentUser().role === 'admin' || idea.author._id == Auth.getCurrentUser()._id)
        return true;
      else
        return false;
    };

    $scope.getColor = function(idea) {
      return $scope.categoryMap[idea.category];
    };

    $scope.getAverageRating = function(idea, roundDown) {
      var average = 0;
      if(idea.raterCount != 0) {
        average = (idea.totalRatingCount / idea.raterCount).toFixed(1);
        if(roundDown) {
          average = Math.floor(average);
        }
      }
      return average;
    };

    $scope.openUpdateStateModal = function (nextState, idea) {
      $scope.nextState = nextState;
      $scope.idea = idea;
      $scope.modalWindowOpen = true;

      $scope.modalInstance = $modal.open({
        templateUrl: 'updateStateModal',
        windowClass: 'updateStateModal',
        scope: $scope
      });

      $scope.modalInstance.result.then(function () {
        $scope.updateState(nextState, idea);
      });

      $scope.modalInstance.result.finally(function () {
        $scope.modalWindowOpen = false;
      });
    };


    /*
    Scope functions
     */

    $scope.addIdea = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $http.post('/api/ideas', {
          name: $scope.idea.title,
          description: $scope.idea.description,
          author: Auth.getCurrentUser()._id,
          state: $scope.states[0].value,
          category: $scope.idea.category
        });
        $scope.idea.title = '';
        $scope.idea.description = '';
        $scope.idea.category = '';
        $scope.submitted = false;
      }
    };

    $scope.deleteIdea = Modal.confirm.delete(function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    });

    $scope.updateState = function(state, idea) {
      $http.put('/api/ideas/'+idea._id, { state: state} );
    };

    $scope.addRating = function(idea) {
      if (idea.currentRating > 0) {
        $http.post('/api/ratings', { star_rating: idea.currentRating, idea: idea._id, author: Auth.getCurrentUser()._id } );
        $http.put('/api/ideas/' + idea._id, {totalRatingCount: idea.totalRatingCount + idea.currentRating, raterCount: idea.raterCount + 1} );
      }
    };
  });
