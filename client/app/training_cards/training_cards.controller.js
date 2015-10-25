'use strict';

angular.module('teamtoolApp')
  .controller('TrainingCardsCtrl', function  ($scope, $http, socket) {

    var vm = this;

    vm.new_training_card = {};

    vm.training_cards = [];


    $http.get('/api/training_cards').success(function(training_cards) {
      vm.training_cards = training_cards;
      socket.syncUpdates('training_card', vm.training_cards);
    });

    vm.addTrainingCard = function() {
      if(vm.new_training_card === '') {
        return;
      }
      $http.post('/api/training_cards', { title: vm.new_training_card.title });
      vm.new_training_card = '';
    };

    vm.deleteTrainingCard = function(training_card) {
      $http.delete('/api/training_cards/' + training_card._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('training_card');
    });
  });
