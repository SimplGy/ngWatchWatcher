var ww = angular.module('theWatchWatcher',[]);


// Usage:
// scopesE   = scopeCounters.byEl();
// scopesS   = scopeCounters.byScope();
// watchersE = watchCounters.byEl();
// watchersS = watchCounters.byScope();

ww.directive('watchLight', [ '$rootScope', function($rootScope){
  return {
    restrict: 'E',
    template: '<i class="watchLight"\n   title="Blinking indicates $digest loop activity"\n   style="display: block; position: fixed; top: 10px; right: 10px; width:14px; height:14px; border-radius: 50%; background-color: #ddd;\n  -webkit-transition:background-color .15s, box-shadow .04s;\n  transition:background-color .15s, box-shadow .04s;\n"></i>',
    replace: true,
    link: function(scope, el, attrs){

      var startTime = Date.now();
      var watchCount = 0;
      var turnOffLighter, turnOffShimmer;

      function lightUp() {
        el.css('background-color', '#5AB953');
        el.css('box-shadow', 'inset 0 0 0 2px #29832B');
      }
      function unLighter() { el.css('background-color', '#ddd'); } // The light effect is slow and stays for a while, giving you a sense of general activity.
      function unShimmer() { el.css('box-shadow', 'inset 0 0 0 0 #49A34B'); } // The shimmer effect is quick and leaves quickly, giving you a sense for rapid activity

      function creepedOn() {
        watchCount++;
        console.log('watch ' + watchCount);
        lightUp();
        clearTimeout(turnOffLighter);
        clearTimeout(turnOffShimmer);
        turnOffLighter = setTimeout(unLighter, 500);
        turnOffShimmer = setTimeout(unShimmer, 100);
        return false; // Always return the same thing, so we don't trigger a watch change.
      }

      // Set this up on $rootScope, since we don't want DOM placement to determine which scope we're monitoring.
      $rootScope.$watch(creepedOn);
    }
  }
}]);


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


