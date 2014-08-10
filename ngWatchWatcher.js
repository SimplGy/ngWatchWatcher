

angular.module('watchWatcher',[]);


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
    countChildren: countChildrenOfScope,
    byEl: scopesByEl,
    byScope: scopesByScope
  };
}]);

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

angular.module('watchWatcher').controller('WatchLightController',   function() {

//  var startTime = Date.now();
  var cleanUpFrequency = 5000; // how often to clean up the stored information
  var digestsToKeep = 50; // How many recent digests to store
  var watchCount = 0;
  var recentDigests = [];

  // Track that a watch happened
  function countWatch() {
    watchCount++;
    var curDigest = { start: Date.now() };
    recentDigests.push(curDigest);
    setTimeout(function(){
      curDigest.end = Date.now();
      curDigest.duration = curDigest.end - curDigest.start;
    },0); // measure the compute time of the digest loop by assuming it's blocking
  }

  // Given an array of digest, how many digests were there per second, on average?
  function getDigestsPerSecond(digests) {
    digests = digests || recentDigests;
    var count = digests.length;
    var time = digests[count - 1].start - digests[0].start;
    time /= 1000;
    return Math.round(count / time * 10) / 10;
  }

  // Given an array of digests, what was the average duration?
  function getAverageDigestDuration(digests) {
    digests = digests || recentDigests;
    var i, len, duration, sum = 0;
    for (i=0,len=digests.length; i<len; i++){
      duration = digests[i].duration
      if (duration) { // avoid any NaNs that may have shown up, 0s (falsy) are safe to ignore
        sum += duration;
      }
    }
    return Math.round(sum / len * 10) / 10;
  }

  function logInformation(){
    console.log(
      '\n' +
        'Digest Information\n' +
        '------------------\n' +
        'Digests Per Second:      ' + getDigestsPerSecond(recentDigests)      + ' digests   (fewer is less taxing)\n' +
        'Average Digest Duration: ' + getAverageDigestDuration(recentDigests) + ' ms        (shorter is more performant)\n' +
//          'Recent Digest Count:     ' + recentDigests.length + '\n' +
        'Watches Fired So Far:    ' + watchCount + '\n' +
        '\n',
      { digests: recentDigests }
    );
  }

  setInterval(cleanUp, cleanUpFrequency);
  function cleanUp() {
    // Trim the recent digests to last 100 so they don't get huge
    if (recentDigests.length > digestsToKeep) {
      recentDigests = recentDigests.slice( - digestsToKeep);
    }
  }

  // Publicize
  this.cleanUp = cleanUp;
  this.countWatch = countWatch;
  this.logInformation = logInformation;
  this.getDigestsPerSecond = getDigestsPerSecond;
  this.getAverageDigestDuration = getAverageDigestDuration;
  this.getRecentDigests = function(){ return recentDigests };

});


angular.module('watchWatcher').directive('watchLight', [ '$rootScope', function($rootScope){
  return {
    restrict: 'E',
    template: '<i class="watchLight"\n   title="Blinking indicates $digest loop activity.\nClick to log details."\n   style="cursor: pointer;\n   display: block; position: fixed;\n   top: 10px; right: 10px;\n   width:14px; height:14px;\n   border-radius: 50%; background-color: #ddd;\n   -webkit-transition:background-color .15s, box-shadow .04s;\n   transition:background-color .15s, box-shadow .04s;\n"></i>',
    replace: true,
    controller: 'WatchLightController',
    link: function(scope, el, attrs, controller){

      var turnOffLighter, turnOffShimmer;

      // Light up the bulb, and set timeouts to un-light it after a bit
      function doLightUp(color, shimmerColor) {
        color = color || '#5AB953';
        shimmerColor = shimmerColor || '#29832B';
        el.css('background-color', color);
        el.css('box-shadow', 'inset 0 0 0 2px ' + shimmerColor);
        clearTimeout(turnOffLighter);
        clearTimeout(turnOffShimmer);
        turnOffLighter = setTimeout(unLighter, 700);
        turnOffShimmer = setTimeout(unShimmer, 100);
      }
      function unLighter() { el.css('background-color', '#ddd'); } // The light effect is slow and stays for a while, giving you a sense of general activity.
      function unShimmer() { el.css('box-shadow', 'inset 0 0 0 0 #49A34B'); } // The shimmer effect is quick and leaves quickly, giving you a sense for rapid activity

      // On click, show something useful
      el.on('click', function(){
        doLightUp('#69d', '#369');
        controller.cleanUp();
        controller.logInformation();
      });



      function onRootScopeWatch() {
        controller.countWatch();
        doLightUp();
        return false; // Always return the same thing, so we don't trigger a watch change.
      }

      // Set this up on $rootScope, since we don't want DOM placement to determine which scope we're monitoring.
      $rootScope.$watch(onRootScopeWatch);
    }
  }
}]);