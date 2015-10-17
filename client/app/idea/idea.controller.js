'use strict';

function descLimitFilter($filter) {
  return function(input, expanded) {
    return expanded || input.length < 200 ? input : $filter('limitTo')(input, 200) + ' .....';
  }
}


function IdeaCtrl($scope, $http, $filter, $modal, socket, Auth, Modal) {

  /*
  Constants
   */

  var vm = this;

  vm.awesomeIdeas = [];
  vm.ratings = [];
  vm.newIdea = {};

  vm.states = [
    { value:'Open' },
    { value:'Accepted' },
    { value:'In Progress' },
    { value:'Implemented' },
    { value:'Rejected' }
  ];

  vm.categoryMap = {
    'Ideas Backlog' : 'dodgerblue',
    'Training Catalog' : 'limegreen',
    'User Settings' : 'orange',
    'Login/Logout' : 'orchid',
    'Other' : 'darkred'
  };

  vm.categories = Object.keys(vm.categoryMap);


  /*
   Scope Api calls
   */

  $http.get('/api/ideas').success(function(awesomeIdeas) {
    vm.awesomeIdeas = awesomeIdeas;
    socket.syncUpdates('idea', vm.awesomeIdeas);
    angular.forEach(vm.awesomeIdeas, function(item) {
      item.expanded = false;
    });
  });

  $http.get('/api/ratings').success(function(ratings) {
    vm.ratings = ratings;
    socket.syncUpdates('rating', vm.ratings);
  });


  /*
  Util functions
   */

  vm.isLoggedIn = function() {
    return Auth.isLoggedIn();
  };


  /*
  For View
   */

  // Sort

  vm.sortCriterion = "date";
  vm.sortCriterionLabel = "date (newest first) ";
  vm.sortReverse = true;

  vm.getFirstSortCriterion = function(idea) {
    if((vm.sortCriterion == "totalStarCount" || vm.sortCriterion == "averageRating") && !vm.isIdeaRatedOrCreatedByCurrentUser(idea))
      return 0;
    else if(vm.sortCriterion == "author.username")
      return idea.author.username;
    else
      return idea[vm.sortCriterion];
  };

  vm.getSecondSortCriterion = function(idea) {
    if(vm.sortCriterion == "averageRating")
      return idea.raterCount;
    else if (!vm.isIdeaRatedOrCreatedByCurrentUser(idea))
      return 0;
    else
      return vm.fixReversing(idea.averageRating);
  };

  vm.getThirdSortCriterion = function(idea) {
    if(vm.sortCriterion == "totalStarCount")
      // For this case: isIdeaRatedOrCreatedByCurrentUser = false (1. & 2. criteria = 0) Green ideas
      return idea.raterCount;
    else
      return vm.fixReversing(idea.raterCount);
  };

  vm.fixReversing = function(number) {
    // Category and username ordering should sort "also in reverse" in the right direction
    if((vm.sortCriterion == "category" || vm.sortCriterion == "author.username") && !vm.sortReverse)
      return number * -1;
    else
      return number;
  };


  // Other View

  vm.toggle = function(item) {
    item.expanded = !item.expanded;
  };

  vm.isCollapsed = true;

  $scope.$watch('vm.isCollapsed', function(){
    vm.ideaFormToggleText = vm.isCollapsed ? 'Create Idea' : 'Close Form';
  });

  vm.allowedToDelete = function(idea) {
    return Auth.getCurrentUser().role === 'admin' || vm.isIdeaCreatedByCurrentUser(idea);
  };

  vm.allowedToRate = function(idea) {
    return vm.isLoggedIn() && !vm.isIdeaRatedOrCreatedByCurrentUser(idea) && idea.state == vm.states[0].value;
  };

  vm.isIdeaRatedOrCreatedByCurrentUser = function(idea) {
    return vm.isIdeaRatedByCurrentUser(idea) || vm.isIdeaCreatedByCurrentUser(idea);
  };

  vm.isIdeaCreatedByCurrentUser = function(idea) {
    return idea.author._id == Auth.getCurrentUser()._id;
  };

  vm.isIdeaRatedByCurrentUser = function(idea) {
    var my_rating_for_the_idea =  $filter('filter')(vm.ratings, {idea:idea._id, author: Auth.getCurrentUser()._id});
    if (my_rating_for_the_idea.length == 0)
      return false;
    else
      return true;
  };

  vm.getColor = function(idea) {
    return vm.categoryMap[idea.category];
  };

  vm.getNumberFloored = function(number) {
    return Math.floor(number);
  };

  vm.openUpdateStateModal = function (nextState, idea) {
    vm.modalWindowOpen = true;
    vm.nextState = nextState;
    $scope.idea = idea;

    vm.modalInstance = $modal.open({
      templateUrl: 'updateStateModal',
      windowClass: 'updateStateModal',
      scope: $scope
    });

    vm.modalInstance.result.then(function () {
      vm.updateState(nextState, idea);
    });

    vm.modalInstance.result.finally(function () {
      vm.modalWindowOpen = false;
    });
  };


  /*
  Scope functions
   */

  vm.addIdea = function(form) {
    vm.submitted = true;

    if(form.$valid) {
      $http.post('/api/ideas', {
        name: vm.newIdea.title,
        description: vm.newIdea.description,
        author: Auth.getCurrentUser()._id,
        state: vm.states[0].value,
        category: vm.newIdea.category
      });
      vm.newIdea.title = '';
      vm.newIdea.description = '';
      vm.newIdea.category = '';
      vm.submitted = false;
    }
  };

  vm.deleteIdea = Modal.confirm.delete(function(idea) {
    $http.delete('/api/ideas/' + idea._id);
  });

  vm.updateState = function(state, idea) {
    $http.put('/api/ideas/'+idea._id, { state: state} );
  };

  vm.addRating = function(idea) {
    if (idea.currentRating > 0) {
      $http.post('/api/ratings', { star_rating: idea.currentRating, idea: idea._id, author: Auth.getCurrentUser()._id } );
      $http.put('/api/ideas/' + idea._id, {totalStarCount: idea.totalStarCount + idea.currentRating, raterCount: idea.raterCount + 1} );
    }
  };
}
