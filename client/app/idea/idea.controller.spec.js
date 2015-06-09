'use strict';

describe('Controller: IdeaCtrl', function () {

  // load the controller's module
  beforeEach(module('teamtoolApp'));

  var IdeaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IdeaCtrl = $controller('IdeaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
