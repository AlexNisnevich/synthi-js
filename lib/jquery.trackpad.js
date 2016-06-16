/* By Jacob Nisnevich and Alex Nisnevich */
(function($){
  $.fn.trackPad = function(props) {
    var options = $.extend({
      width: "300px",
      height: "200px",
      markerDiameter: "50px",
      markerColor: "#DDD"
    }, props || {});

    return this.each(function() {
      var el = $(this),
         doc = $(document);

      el.addClass("trackpad-base").append("<div class='trackpad-marker'></div>").css({
        width: options.width,
        height: options.height
      });

      var marker = $(".trackpad-marker", el);
      var markerRadius = parseInt(options.markerDiameter) / 2;

      var width = parseInt(options.width);
      var height = parseInt(options.height);
      
      marker.css({
        width: options.markerDiameter,
        height: options.markerDiameter,
        background: options.markerColor,
        top: parseInt(options.height) / 2 - markerRadius,
        left: parseInt(options.width) / 2 - markerRadius
      });

      el.on("mousedown", function(ev) {
        var top = el.offset().top,
           left = el.offset().left;

        var xScale = el[0].getBoundingClientRect().width / width,
            yScale = el[0].getBoundingClientRect().height / height;

        var drawQueue = null;

        function moveTo(ev) {
          var topOffset = (ev.pageY - top) / yScale;
          var leftOffset = (ev.pageX - left) / xScale;

          if (topOffset < 0) {
            topOffset = 0;
          } else if (topOffset > height) {
            topOffset = height;
          }

          if (leftOffset < 0) {
            leftOffset = 0;
          } else if (leftOffset > width) {
            leftOffset = width;
          }

          clearTimeout(drawQueue);
          drawQueue = setTimeout(function () {
            marker.css({
              transform: "translate(" + (leftOffset - width/2) + "px," + (topOffset - height/2) + "px)"
            });
          }, 5);
        }

        moveTo(ev);

        doc.on("mousemove.rem touchmove.rem", function(ev) {
          moveTo(ev);
        });

        doc.on("mouseup.rem", function(ev) {
          doc.off('.rem');

          clearTimeout(drawQueue);
          
          marker.css({
            transform: "none"
          });
        });
      });
    });
  }
})(jQuery);