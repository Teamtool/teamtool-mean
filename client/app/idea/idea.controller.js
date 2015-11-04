'use strict';

function descLimitFilter($filter) {
  return function(input, expanded) {
    return expanded || input.length < 280 ? input : $filter('limitTo')(input, 230) + ' .....';
  }
}

function IdeaCtrl($scope, $http, $uibModal, socket, Auth, Modal) {

  /*
  Constants
   */

  var vm = this;

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
    // anonymisation of ratings
    if((vm.sortCriterion == "totalStarCount" || vm.sortCriterion == "averageRating") && !vm.isIdeaRatedOrCreatedByCurrentUser(idea))
      return 0;
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
    return vm.fixReversing(idea.raterCount);
  };

  vm.getFourthSortCriterion = function(idea) {
    if(vm.sortReverse)
      return new Date(idea.date).getTime();
    else
      return new Date(idea.date).getTime() * -1;
  };

  vm.fixReversing = function(number) {
    // Category and username ordering should sort "also in reverse" in the right direction of rating/rater
    if((vm.sortCriterion == "category" || vm.sortCriterion == "author") && !vm.sortReverse)
      return number * -1;
    else
      return number;
  };


  // Other View

  vm.toggle = function(item) {
    item.expanded = !item.expanded;
  };

  vm.isCollapsed = true;

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
    return idea.author == Auth.getCurrentUser().username;
  };

  vm.isIdeaRatedByCurrentUser = function(idea) {
    if (_.findWhere(idea.ratings, {'rater':Auth.getCurrentUser().username}))
      return true;
    else
      return false;
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

    vm.modalInstance = $uibModal.open({
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
        title: vm.newIdea.title,
        description: vm.newIdea.description,
        author: Auth.getCurrentUser().username,
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
    $http.put('/api/ideas/'+idea._id, { state: 'Deleted'} );
  });

  vm.updateState = function(state, idea) {
    $http.put('/api/ideas/'+idea._id, { state: state} );
  };

  vm.addRating = function(idea) {
    if (idea.currentRating > 0) {
      $http.put('/api/ideas/' + idea._id + '/ratings', {
          rater: Auth.getCurrentUser().username,
          star: idea.currentRating
      });
    }
  };
}
