'use strict';

function QuestionAnswerCtrl($scope, $http, $uibModal, socket, Auth, Modal) {

  /*
   Constants
   */

  var vm = this;

  vm.newQuestionAnswer = {};

  vm.states = [
    { value:'Open' },
    { value:'Answered' },
    { value:'Current' }
  ];

  /*
   Scope Api calls
   */

  $http.get('/api/question_answers').success(function(questionAnswers) {
    vm.questionAnswers = questionAnswers;
    socket.syncUpdates('question_answer', vm.questionAnswers);
  });

  /*
   Util functions
   */

  vm.isLoggedIn = function() {
    return Auth.isLoggedIn();
  };

  vm.isAdmin = function() {
    return Auth.isAdmin();
  };


  /*
   For View
   */

  vm.currentQuestion = false;

  // Sort

  vm.sortCriterion = "averageRating";
  vm.sortCriterionLabel = "best average rated ";
  vm.sortReverse = true;

  vm.getFirstSortCriterion = function(questionAnswer) {
    if(questionAnswer.state == 'Current' && vm.sortReverse)
      return 1;
    else if(questionAnswer.state == 'Current' && !vm.sortReverse)
      return -1;
    else
      return 0;
  };

  vm.getSecondSortCriterion = function(questionAnswer) {
    // anonymisation of ratings
    if((vm.sortCriterion == "totalStarCount" || vm.sortCriterion == "averageRating") && !vm.isQuestionRatedOrCreatedByCurrentUser(questionAnswer))
      return 0;
    else
      return questionAnswer[vm.sortCriterion];
  };

  vm.getThirdSortCriterion = function(questionAnswer) {
    if(vm.sortCriterion == "averageRating")
      return questionAnswer.raterCount;
    else if (!vm.isQuestionRatedOrCreatedByCurrentUser(questionAnswer))
      return 0;
    else
      return vm.fixReversing(questionAnswer.averageRating);
  };

  vm.getFourthSortCriterion = function(questionAnswer) {
    return vm.fixReversing(questionAnswer.raterCount);
  };

  vm.getFifthSortCriterion = function(questionAnswer) {
    questionAnswer.dateJS = new Date(questionAnswer.date);
    if(vm.sortReverse)
      return questionAnswer.dateJS.getTime();
    else
      return questionAnswer.dateJS.getTime() * -1;
  };

  vm.fixReversing = function(number) {
    // Username ordering should sort "also in reverse" in the right direction of rating/rater
    if(vm.sortCriterion == "author" && !vm.sortReverse)
      return number * -1;
    else
      return number;
  };


  // Other View

  vm.allowedToDelete = function(questionAnswer) {
    return (Auth.getCurrentUser().role === 'admin' || vm.isQuestionCreatedByCurrentUser(questionAnswer)) && questionAnswer.state == vm.states[0].value;
  };

  vm.allowedToRate = function(questionAnswer) {
    return vm.isLoggedIn() && !vm.isQuestionRatedOrCreatedByCurrentUser(questionAnswer) && questionAnswer.state == vm.states[0].value;
  };

  vm.isQuestionRatedOrCreatedByCurrentUser = function(questionAnswer) {
    return vm.isQuestionRatedByCurrentUser(questionAnswer) || vm.isQuestionCreatedByCurrentUser(questionAnswer);
  };

  vm.isQuestionCreatedByCurrentUser = function(questionAnswer) {
    return questionAnswer.author == Auth.getCurrentUser().username;
  };

  vm.isQuestionRatedByCurrentUser = function(questionAnswer) {
    if (_.findWhere(questionAnswer.ratings, {'rater':Auth.getCurrentUser().username}))
      return true;
    else
      return false;
  };

  vm.getNumberFloored = function(number) {
    return Math.floor(number);
  };

  vm.openUpdateStateModal = function (nextState, questionAnswer) {
    vm.modalWindowOpen = true;
    vm.nextState = nextState;
    $scope.questionAnswer = questionAnswer;

    vm.modalInstance = $uibModal.open({
      templateUrl: 'updateStateModal',
      windowClass: 'updateStateModal',
      scope: $scope
    });

    vm.modalInstance.result.then(function () {
      vm.updateState(nextState, questionAnswer);
    });

    vm.modalInstance.result.finally(function () {
      vm.modalWindowOpen = false;
    });
  };


  /*
   Scope functions
   */

  vm.addQuestion = function(form) {
    vm.submitted = true;
    if(form.$valid) {
      $http.post('/api/question_answers', {
        text: vm.newQuestionAnswer.text,
        author: Auth.getCurrentUser().username,
        state: vm.states[0].value
      });
      vm.newQuestionAnswer.text = '';
      vm.submitted = false;
    }
  };

  vm.deleteQuestion = Modal.confirm.delete(function(questionAnswer) {
    $http.delete('/api/question_answers/' + questionAnswer._id);
  });

  vm.updateState = function(state, questionAnswer) {
    if(state == vm.states[2].value)
      vm.currentQuestion=true;
    else if(state == vm.states[1].value)
      vm.currentQuestion=false;

    $http.put('/api/question_answers/'+ questionAnswer._id, { state: state} );
  };

  vm.addRating = function(questionAnswer) {
    if (questionAnswer.currentRating > 0) {
      $http.put('/api/question_answers/' + questionAnswer._id + '/ratings', {
        rater: Auth.getCurrentUser().username,
        star: questionAnswer.currentRating
      });
    }
  };
}
