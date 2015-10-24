'use strict';

angular.module('teamtoolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('training_cards', {
        url: '/training_cards',
        templateUrl: 'app/training_cards/training_cards.html',
        controller: 'TrainingCardsCtrl'
      });
  });