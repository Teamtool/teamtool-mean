'use strict';

angular.module('teamtoolApp')
  .controller('IdeaCtrl', function ($scope, $http, $filter, $modal, socket, Auth, Modal) {
    $scope.awesomeIdeas = [];
    $scope.ratings = [];

    $scope.states = [
      { value:'Open' },
      { value:'Accepted' },
      { value:'In Progress' },
      { value:'Implemented' },
      { value:'Rejected' }
    ];

/*    $scope.categoriesOld = [
      { value:'Ideas Backlog', color:'dodgerblue' },
      { value:'Training Catalog', color:'limegreen' },
      { value:'User Settings', color:'orange' },
      { value:'Login/Logout', color:'orchid' },
      { value:'Other', color:'darkred' }
    ];*/

    $scope.categoryMap = {
      'Ideas Backlog' : 'dodgerblue',
      'Training Catalog' : 'limegreen',
      'User Settings' : 'orange',
      'Login/Logout' : 'orchid',
      'Other' : 'darkred'
    };

    $scope.categories = Object.keys($scope.categoryMap);

    $scope.isCollapsed = true;

    $scope.$watch('isCollapsed', function(){
      $scope.ideaFormToggleText = $scope.isCollapsed ? 'Create Idea' : 'Close Form';
    });

    $scope.isLoggedIn = function() {
      return Auth.isLoggedIn();
    };

    $http.get('/api/ideas').success(function(awesomeIdeas) {
      $scope.awesomeIdeas = awesomeIdeas;
      socket.syncUpdates('idea', $scope.awesomeIdeas);
    });

    $http.get('/api/ratings').success(function(ratings) {
      $scope.ratings = ratings;
      socket.syncUpdates('rating', $scope.ratings);
    });

    $scope.addIdea = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $http.post('/api/ideas', { name: $scope.idea.title , description: $scope.idea.description, author: Auth.getCurrentUser()._id, state: $scope.states[0].value, category: $scope.idea.category });
        $scope.idea.title = '';
        $scope.idea.description = '';
        $scope.idea.category = '';
        $scope.submitted = false;
      }

    };

    $scope.deleteIdea = Modal.confirm.delete(function(idea) {
      $http.delete('/api/ideas/' + idea._id);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('idea');
      socket.unsyncUpdates('rating');
    });

    $scope.getStarSum = function(idea) {
      var sum = 0;
      var ideas_rating =  $filter('filter')($scope.ratings, {idea:idea._id});
      for (var i = 0; i < ideas_rating.length; i++){
        sum += parseInt(ideas_rating[i].star_rating, 10); //don't forget to add the base
      }
      return sum;
    };

    $scope.getStarAverage = function(idea) {
      var sum = $scope.getStarSum(idea);

      var ideas_rating =  $filter('filter')($scope.ratings, {idea:idea._id});
      if (ideas_rating.length > 0)
        return (sum / ideas_rating.length).toFixed(1);
      else
        return 0;
    };

    $scope.getVotes = function(idea) {
      var no_ratings =  $filter('filter')($scope.ratings, {idea:idea._id});
      return no_ratings.length;
    };

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

    $scope.updateState = function(state, idea) {
      $http.put('/api/ideas/'+idea._id, { state: state} );

    };

/*    $scope.getColorOld = function(idea) {
      for (var i = 0; i < $scope.categories.length; i++) {
        if(idea.category == $scope.categories[i].value) {
          return $scope.categories[i].color;
        }
      }
    };*/

    $scope.getColor = function(idea) {
      return $scope.categoryMap[idea.category];
    };

    $scope.addRating = function(idea) {
      var my_rating =  $filter('filter')($scope.ratings, {idea:idea._id, author: Auth.getCurrentUser()._id});
      if (my_rating.length == 0 && idea.rating > 0 )
      {
        $http.post('/api/ratings', { star_rating: idea.rating, idea: idea._id, author: Auth.getCurrentUser()._id } );
      }
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

  });
