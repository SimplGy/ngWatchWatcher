
// Usage:
// watchersE = watchCounters.byEl();
// watchersS = watchCounters.byScope();


angular.module('watchWatcher').factory('watchCounters', [ '$rootScope', function($rootScope) {

  // Given a DOM element, return an array of watchers on it and children
  // Uses DOM traversal to find children.
  // If no element is passed in, it uses the `body` element
  function watchersByEl(element) {
    element = element || angular.element(document.body);
    var watchers;
    watchers = [];
    if (element.data().hasOwnProperty('$scope')) {
      watchers = watchers.concat(element.data().$scope.$$watchers);
    }
    angular.forEach(element.children(), function(childElement) {
      return watchersByEl($(childElement));
    });
    return watchers;
  }

  // Given a scope, return all watchers on it and it's children.
  // Uses scope traversal to find children.
  function watchersByScope(scope) {
    var q = [ scope || $rootScope ];
    var watchers = [];
    var curScope = null;
    while (q.length > 0) {
      curScope = q.pop();
      if (curScope.$$watchers) {
        watchers = watchers.concat(curScope.$$watchers);
      }
      if (curScope.$$childHead) {
        q.push(curScope.$$childHead);
      }
      if (curScope.$$nextSibling) {
        q.push(curScope.$$nextSibling);
      }
    }
    return watchers;
  }

  // Publicize
  return api = {
    byEl: watchersByEl,
    byScope: watchersByScope
  };
}]);