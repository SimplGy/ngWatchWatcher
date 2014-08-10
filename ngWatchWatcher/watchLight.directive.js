

angular.module('watchWatcher').directive('watchLight', [ '$rootScope', function($rootScope){
  return {
    restrict: 'E',
    template: '<i class="watchLight"\n   title="Blinking indicates $digest loop activity.\nClick to log details."\n   style="cursor: pointer;\n   display: block; position: fixed;\n   top: 10px; right: 10px;\n   width:14px; height:14px;\n   border-radius: 50%; background-color: #ddd;\n   -webkit-transition:background-color .15s, box-shadow .04s;\n   transition:background-color .15s, box-shadow .04s;\n"></i>',
    replace: true,
    link: function(scope, el, attrs){

      var startTime = Date.now();
      var watchCount = 0;
      var recentDigests = [];
      var turnOffLighter, turnOffShimmer;
      var cleanUpFrequency = 5000; // how often to clean up the stored information
      var digestsToKeep = 100; // How many recent digests to store

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

      function creepedOn() {
        watchCount++;
        var curDigest = { start: Date.now() };
        recentDigests.push(curDigest);
        setTimeout(function(){
          curDigest.end = Date.now();
          curDigest.duration = curDigest.end - curDigest.start;
        },0); // measure the compute time of the digest loop by assuming it's blocking
        doLightUp();
        return false; // Always return the same thing, so we don't trigger a watch change.
      }

      // Given an array of digest, how many digests were there per second, on average?
      function getDigestsPerSecond(digests) {
        var count = digests.length;
        var time = digests[count - 1].start - digests[0].start;
        time /= 1000;
        return Math.round(count / time * 10) / 10;
      }

      // Given an array of digests, what was the average duration?
      function getAverageDigestDuration(digests) {
        var i, len, duration, sum = 0;
        for (i=0,len=digests.length; i<len; i++){
          duration = digests[i].duration
          if (duration) { // avoid any NaNs that may have shown up
            sum += duration;
          }
        }
        return Math.round(sum / len * 10) / 10;
      }

      // On click, show something useful
      el.on('click', function(){
        doLightUp('#69d', '#369');
        cleanUp();
        console.log(
          '\n' +
          'Digest Information\n' +
          '------------------\n' +
          'Digests Per Second:      ' + getDigestsPerSecond(recentDigests)      + ' digests (fewer is better)\n' +
          'Average Digest Duration: ' + getAverageDigestDuration(recentDigests) + ' ms      (shorter is better)\n' +
//          'Recent Digest Count:     ' + recentDigests.length + '\n' +
          'Watches Fired So Far:    ' + watchCount + '\n' +
          '\n',
          { digests: recentDigests }
        );
      });


      setInterval(cleanUp, cleanUpFrequency);
      function cleanUp() {
        // Trim the recent digests to last 100 so they don't get huge
        if (recentDigests.length > digestsToKeep) {
          recentDigests = recentDigests.slice( - digestsToKeep);
        }
      }

      // Set this up on $rootScope, since we don't want DOM placement to determine which scope we're monitoring.
      $rootScope.$watch(creepedOn);
    }
  }
}]);