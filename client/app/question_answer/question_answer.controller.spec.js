'use strict';

describe('Controller: QuestionAnswerCtrl', function () {

  // load the controller's module
  beforeEach(module('teamtoolApp'));

  var QuestionAnswerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionAnswerCtrl = $controller('QuestionAnswerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
