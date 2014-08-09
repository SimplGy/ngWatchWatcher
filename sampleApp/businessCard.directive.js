angular.module('sampleApp').directive('businessCard', function(){
  return {
    restrict: 'E',
    scope: { person: '=' },
    templateUrl: 'sampleApp/businessCard.html',
    link: function (scope) {}
  };
});