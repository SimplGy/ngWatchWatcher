// Usage:
// scopesE   = scopeCounters.byEl();
// scopesS   = scopeCounters.byScope();


angular.module('watchWatcher').factory('scopeCounters', [ '$rootScope', function($rootScope) {

  // Given a scope object, return a count of all the children
  // This only counts immediate children. It is not recursive and does not count grandchildren.
  // If no scope is passed in, it uses $rootScope
  function countChildrenOfScope(scope) {
    scope = scope || $rootScope;
    var count, cur;
    count = 0;
    if (scope.$$childHead) {
      count++;
      cur = scope.$$childHead;
      while (cur.$$nextSibling) {
        count++;
        cur = cur.$$nextSibling;
      }
    }
    return count;
  }

  // Given a DOM element, return an array of scopes on it and children
  // Uses DOM traversal to find children
  // If no element is passed in, it uses the `body` element
  function scopesByEl(el) {
    el = el || document.body;
    el = angular.element(el);
    var scopes;
    scopes = [];
    if (el.data().hasOwnProperty('$scope')) {
      scopes.push(el.data().$scope);
    }
    angular.forEach(el.children(), function(child) {
      return scopesByEl(child);
    });
    return scopes;
  }

  // Given a scope, return all scopes on it and it's children.
  // Uses scope traversal to find children.
  function scopesByScope(scope) {
    var q = [ scope || $rootScope ];
    var scopes = [];
    var curScope = null;
    while (q.length > 0) {
      curScope = q.pop();
      if (curScope) {
        scopes.push(curScope);
      }
      if (curScope.$$childHead) {
        q.push(curScope.$$childHead);
      }
      if (curScope.$$nextSibling) {
        q.push(curScope.$$nextSibling);
      }
    }
    return scopes;
  }

  // Publicize
  return api = {
    countChildren: countChildrenOfScope,
    byEl: scopesByEl,
    byScope: scopesByScope
  };
}]);