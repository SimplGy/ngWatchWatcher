
angular.module('watchWatcher').controller('WatchLightController', function() {

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

  function logInformation(){
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