'use strict';

angular.module('teamtoolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question_answer', {
        url: '/question_answer',
        templateUrl: 'app/question_answer/question_answer.html',
        controller: 'QuestionAnswerCtrl'
      });
  });