angular.module('sampleApp').directive('introText', function(){
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      var margin = 10;

      setTimeout(showTip, 2000);

      function showTip() {
        var tip = $("<p style='position: fixed; transition: all .3s; box-shadow: 0 0 0 3px white; display:inline-block; padding: 5px; border-radius: 3px; font-size:14px; background: black; color: white;'>" + attrs.introText + "</p>");
//      tip.css( 'top', el.offset().top + el.height() );
//      tip.css( 'right', el.offset().top + el.height() );
        tip.css( 'top', '-100px');



        tip.appendTo(document.body);
        $(window).on('click', function(){
          tip.remove();
        });

        setTimeout(function(){
          if (el[0].style.top) {
            tip.css( 'top', parseFloat(el[0].style.top) + el.height() + margin );
          } else {
            tip.css( 'bottom', parseFloat(el[0].style.bottom) + el.height() );
          }

          if (el[0].style.right) {
            tip.css( 'right', parseFloat(el[0].style.right));
          } else {
            tip.css( 'left', parseFloat(el[0].style.left));
          }
        }, 1)

        tip.on('click', function(){
          this.remove();
        });
      }


    }
  };
});