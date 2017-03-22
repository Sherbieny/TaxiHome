'use strict';

describe('AccountCtrl', function () {

  beforeEach(module('starter.controllers'));

  var AccountCtrl,
      $httpBackend,
      scope;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_
    AccountCtrl = $controller('AccountCtrl', {
      $scope: scope
    });
  }));

  it('should be connected to its view', function () {

    // $httpBackend.expectPost('http://localhost:3000/bookings',
    //   {latitude: 58.57 , longitude: 26.71})
    //   .respond(201, {message: 'Booking is being processed'})
    //
    //   expect(typeof($scope.submit)).toBe('function')
    expect(scope.source_coordinates).toBeDefined();
  //  expect(scope.source_coordinates).toBeDefined();
  //  expect(scope.destination_coordinates).toBeDefined();
});

});
