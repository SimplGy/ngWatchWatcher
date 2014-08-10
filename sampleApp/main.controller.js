
angular.module('sampleApp').controller('MainController', function($scope, $interval, watchCounters, scopeCounters){

  // Make it easy to get to the counters
//      scope.counters = wwCounters;
  function logCounts() {
    console.log("Counts",{
      watchersByEl:     watchCounters.byEl(),
      watchersByScope:  watchCounters.byScope(),
      scopesByEl:       scopeCounters.byEl(),
      scopesByScope:    scopeCounters.byScope()
    });
  }
//      $interval(logCounts, 3000);
  setTimeout(logCounts, 10);





  // Sample Application Stuff, not part of the Watch Watcher
  $scope.rolodex = [
    {
      firstName: 'Gordon',
      lastName: 'Sumner',
      email: 'sting@thePolice.com',
      phone: 1238675309,
      address1: '123 Sesame St',
      postalCode: '12345'
    },
    {
      firstName: 'Frank',
      lastName: 'Zappa',
      email: 'franktank@spot.com',
      phone: 9887323423,
      address1: '123 Sesame St',
      postalCode: '25422'
    }
  ];

  $scope.user = {
    firstName: 'Your',
    lastName: 'Name'
  };

  $scope.saveCurrentUser = function () {
    $scope.rolodex.push( angular.copy($scope.user) );
    $scope.user = {}; // start fresh
    $scope.userForm.$setPristine();
    $('input:first').focus(); // start in a nice spot
  };

  $scope.addFake = function(computedName){
    $scope.user = {
      firstName: 'Bob',
      lastName: 'Jones',
      computedName: computedName,
      email: 'bob@jones.com',
      phone: 1238675309,
      address1: '123 Sesame St',
      postalCode: Math.floor(Math.random() * 10000)
    }
    $scope.saveCurrentUser();
  }
  // For testing that the duration of digests is actually measured, it should grow when this method is used.
  function computedName() {
    sleep = 10;
    now = Date.now();
    while(Date.now() - now < sleep){};
    return 'Computed Name';
  }
  $scope.addSlowWatch = function(){
    $scope.addFake(computedName);
  }

});