'use strict';

function QuestionAnswerCtrl($scope, $http, $uibModal, socket, Auth, Modal, TimerService) {

  /*
   Constants
   */

  var vm = this;

  vm.successSeconds = 3;
  vm.warningSeconds = 6;
  vm.maxSeconds = 10;

  vm.timer = TimerService.getTimer();

  vm.newQuestionAnswer = {};

  vm.states = [
    { value:'Open' },
    { value:'Answered' },
    { value:'Current' }
  ];

  /*
   Scope Api calls
   */

  vm.startProgressBar = function() {
    TimerService.start(vm.successSeconds, vm.warningSeconds, vm.maxSeconds);
  };

  $http.get('/api/question_answers').success(function(questionAnswers) {
    vm.questionAnswers = questionAnswers;
    socket.syncUpdates('question_answer', vm.questionAnswers);
    initializeOngoingProgressBar();
    vm.setDefaultCriterion();
  });

  function initializeOngoingProgressBar() {
    var questionBeingAnswered = _.findWhere(vm.questionAnswers, {state: vm.states[2].value});
    if(questionBeingAnswered != undefined) {

      var diff = new Date().getTime() - new Date(questionBeingAnswered.answeredAt).getTime();
      var seconds = Math.floor(diff / 1000);

      TimerService.setTimerSeconds(seconds);
      if(!vm.timer.isRunning) {
        vm.startProgressBar();
      }
    }
  }

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

  vm.showQuestionFilter = function(questionAnswer){
    if(vm.states[0].active)
      return questionAnswer.state == vm.states[0].value || questionAnswer.state == vm.states[2].value;
    else
      return questionAnswer.state == vm.states[1].value;
  };

  // Progress Bar


  // Sort


  vm.sortReverse = true;

  vm.setDefaultCriterion = function() {
    if(!vm.isAdmin()) {
      vm.sortCriterion = "date";
      vm.sortCriterionLabel = "date (newest first) ";
    } else {
      vm.sortCriterion = "averageRating";
      vm.sortCriterionLabel = "best average rated ";
    }
  };


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
    if(!vm.sortReverse)
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
    $http.put('/api/question_answers/'+ questionAnswer._id, { state: 'Deleted'} );
  });

  vm.setCurrent = function(questionAnswer) {
    $http.put('/api/question_answers/'+ questionAnswer._id, { state: vm.states[2].value, answeredAt: new Date()} );
    vm.startProgressBar();
  };

  vm.setAnswered = function(questionAnswer) {
    $http.put('/api/question_answers/'+ questionAnswer._id, { state: vm.states[1].value} );
    TimerService.reset();
  };

  vm.addRating = function(questionAnswer) {
    $http.put('/api/question_answers/' + questionAnswer._id + '/ratings', {
      rater: Auth.getCurrentUser().username,
      star: questionAnswer.currentRating
    });

  };
}
