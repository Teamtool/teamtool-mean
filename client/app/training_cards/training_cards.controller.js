'use strict';

angular.module('teamtoolApp')
  .controller('TrainingCardsCtrl', function  ($scope, $http, socket) {

    $scope.new_training_card = {};

    $scope.training_cards = [];


    $http.get('/api/training_cards').success(function(training_cards) {
      $scope.training_cards = training_cards;
      socket.syncUpdates('training_card', $scope.training_cards);
    });

    $scope.addTrainingCard = function() {
      if($scope.new_training_card === '') {
        return;
      }
      $http.post('/api/training_cards', { title: $scope.new_training_card.title });
      $scope.new_training_card = '';
    };

    $scope.deleteTrainingCard = function(training_card) {
      $http.delete('/api/training_cards/' + training_card._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('training_card');
    });
  });
