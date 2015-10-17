'use strict';

angular.module('teamtoolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('idea', {
        url: '/idea',
        templateUrl: 'app/idea/idea.html',
        controller: 'IdeaCtrl'
      });
  })
  .controller('IdeaCtrl', IdeaCtrl)
  .filter('descLimit', descLimitFilter);
