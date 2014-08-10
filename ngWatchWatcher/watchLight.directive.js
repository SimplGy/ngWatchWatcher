

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