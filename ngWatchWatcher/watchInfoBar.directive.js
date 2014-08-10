

angular.module('watchWatcher').directive('watchInfoBar', [ 'watchCounters', 'scopeCounters', function(watchCounters, scopeCounters){
  return {
    restrict: 'E',
    template: '',
    replace: true,
    link: function(scope, el, attrs){

    }
  };
}]);

