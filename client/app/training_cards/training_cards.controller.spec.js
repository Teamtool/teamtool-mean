'use strict';

describe('Controller: TrainingCardsCtrl', function () {

  // load the controller's module
  beforeEach(module('teamtoolApp'));

  var TrainingCardsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrainingCardsCtrl = $controller('TrainingCardsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
