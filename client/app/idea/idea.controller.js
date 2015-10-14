'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, $filter, $modal, socket, Auth, Modal) {

    /*
    Constants
     */

    $scope.awesomeIdeas = [];
    $scope.ratings = [];
    $scope.newIdea = {};

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

    // Sort

    $scope.sortCriterion = "date";
    $scope.sortCriterionLabel = "date (newest first) ";
    $scope.sortReverse = true;

    $scope.getFirstSortCriterion = function(idea) {
      if(($scope.sortCriterion == "totalStarCount" || $scope.sortCriterion == "averageRating") && !$scope.isIdeaRatedOrCreatedByCurrentUser(idea))
        return 0;
      else
        return $scope.getIdeaAttributeByString(idea, $scope.sortCriterion);
    };

    $scope.getSecondSortCriterion = function(idea) {
      if($scope.sortCriterion == "averageRating")
        return idea.raterCount;
      else if (!$scope.isIdeaRatedOrCreatedByCurrentUser(idea))
        return 0;
      else
        return $scope.fixReversing(idea.averageRating);
    };

    $scope.getThirdSortCriterion = function(idea) {
      if($scope.sortCriterion == "totalStarCount")
        return idea.raterCount;
      else
        return $scope.fixReversing(idea.raterCount);
    };

    $scope.fixReversing = function(number) {
      if(($scope.sortCriterion == "category" || $scope.sortCriterion == "author.username") && !$scope.sortReverse)
        return number * -1;
      else
        return number;
    };

    $scope.getIdeaAttributeByString = function(idea, attribute) {
      if(attribute == "date")
        return idea.date;
      if(attribute == "averageRating")
        return idea.averageRating;
      if(attribute == "totalStarCount")
        return idea.totalStarCount;
      if(attribute == "raterCount")
        return idea.raterCount;
      if(attribute == "category")
        return idea.category;
      if(attribute == "author.username")
        return idea.author.username;
    };


    // Other View

    $scope.isCollapsed = true;

    $scope.$watch('isCollapsed', function(){
      $scope.ideaFormToggleText = $scope.isCollapsed ? 'Create Idea' : 'Close Form';
    });

    $scope.isGreenBackgroundActive = function(idea) {
      return $scope.isLoggedIn() && $scope.allowedToRate(idea);
    };

    $scope.allowedToDelete = function(idea) {
      return Auth.getCurrentUser().role === 'admin' || $scope.isIdeaCreatedByCurrentUser(idea);
    };

    $scope.allowedToRate = function(idea) {
      return !$scope.isIdeaRatedOrCreatedByCurrentUser(idea) && idea.state == $scope.states[0].value;
    };

    $scope.isIdeaRatedOrCreatedByCurrentUser = function(idea) {
      return $scope.isIdeaRatedByCurrentUser(idea) || $scope.isIdeaCreatedByCurrentUser(idea);
    };

    $scope.isIdeaCreatedByCurrentUser = function(idea) {
      return idea.author._id == Auth.getCurrentUser()._id;
    };

    $scope.isIdeaRatedByCurrentUser = function(idea) {
      var my_rating_for_the_idea =  $filter('filter')($scope.ratings, {idea:idea._id, author: Auth.getCurrentUser()._id});
      if (my_rating_for_the_idea.length == 0)
        return false;
      else
        return true;
    };

    $scope.getColor = function(idea) {
      return $scope.categoryMap[idea.category];
    };

    $scope.getNumberFloored = function(number) {
      return Math.floor(number);
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
          name: $scope.newIdea.title,
          description: $scope.newIdea.description,
          author: Auth.getCurrentUser()._id,
          state: $scope.states[0].value,
          category: $scope.newIdea.category
        });
        $scope.newIdea.title = '';
        $scope.newIdea.description = '';
        $scope.newIdea.category = '';
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
        $http.put('/api/ideas/' + idea._id, {totalStarCount: idea.totalStarCount + idea.currentRating, raterCount: idea.raterCount + 1} );
      }
    };
  });
