ww = angular.module('theWatchWatcher',[]);


// Usage:
// scopesE   = scopeCounters.byEl();
// scopesS   = scopeCounters.byScope();
// watchersE = watchCounters.byEl();
// watchersS = watchCounters.byScope();



ww.factory('watchCounters', [ '$rootScope', function($rootScope) {

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



ww.factory('scopeCounters', [ '$rootScope', function($rootScope) {

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
  function scopesByEl(element) {
    element = element || angular.element(document.body);
    var scopes;
    scopes = [];
    if (element.data().hasOwnProperty('$scope')) {
      scopes.push(element.data().$scope);
    }
    angular.forEach(element.children(), function(childElement) {
      return scopesByEl($(childElement));
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
//    countChildren: countChildrenOfScope,
    byEl: scopesByEl,
    byScope: scopesByScope
  };
}]);


