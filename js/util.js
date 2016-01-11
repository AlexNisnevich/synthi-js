function Float32Concat(first, second) {
  var firstLength = first.length,
      result = new Float32Array(firstLength + second.length);

  result.set(first);
  result.set(second, firstLength);

  return result;
}

function Float32Interpolate(first, second, delta) {
  var result = new Float32Array(Math.min(first.length, second.length));
  for (var i=result.length; i-->0;) {
    result[i] = first[i] * delta + second[i] * (1 - delta);
  }
  return result;
}

var tables = {
  // ramp = backwards sawtooth
  ramp: flock.fillTable(64, flock.tableGenerators.saw).map(function (x) {return -x;}),
  
  sin: function (shape) {
    if (shape >= 5) {
      // 10 = full positive rectification
      var rectification = (shape - 5) / 5;
      return flock.fillTable(64, flock.tableGenerators.sin).map(function (x) {
        return x * (1 - rectification) + (Math.abs(x)) * rectification;
      });
    } else {
      // 0 = full negative rectification
      var rectification = (5 - shape) / 5;
      return flock.fillTable(64, flock.tableGenerators.sin).map(function (x) {
        return x * (1 - rectification) + (-Math.abs(x)) * rectification;
      });
    }
  },
  
  square: function (shape) {
    // pulse width modulation (5 = normal square wave)

    if (Math.round(shape) == 5) {
      return flock.fillTable(64, flock.tableGenerators.square);
    }

    var posLength = Math.floor(64 * shape / 10);
    var negLength = 64 - posLength;

    var posValues = flock.fillTable(posLength * 2, flock.tableGenerators.square).filter(function (x) {return x > 0});
    var negValues = flock.fillTable(negLength * 2, flock.tableGenerators.square).filter(function (x) {return x < 0});

    return Float32Concat(posValues, negValues);
  },

  triangle: function (shape) {
    var baseTriangle = flock.fillTable(64, flock.tableGenerators.tri);

    if (shape >= 5) {
      // 10 = only increasing section
      var increasingTriangle = flock.fillTable(128, flock.tableGenerators.tri).slice(64,128);
      return Float32Interpolate(increasingTriangle, baseTriangle, (shape - 5) / 5);
    } else {
      // 0 = only decreasing section
      var decreasingTriangle = flock.fillTable(128, flock.tableGenerators.tri).slice(0,64);
      return Float32Interpolate(decreasingTriangle, baseTriangle, (5 - shape) / 5);
    }
  }
};

(function($){
  $.fn.trackPad = function(props) {
    var options = $.extend({
      width: "300px",
      height: "200px",
      markerDiameter: "50px",
      markerColor: "#DDD"
    }, props || {});

    return this.each(function() {
      var el = $(this);

      el.addClass("trackpad-base").append("<div class='trackpad-marker'></div>").css({
        width: options.width,
        height: options.height
      });

      var marker = $(".trackpad-marker", el);
      var markerRadius = parseInt(options.markerDiameter) / 2;
      
      marker.css({
        width: options.markerDiameter,
        height: options.markerDiameter,
        background: options.markerColor,
        top: parseInt(options.height) / 2 - markerRadius,
        left: parseInt(options.width) / 2 - markerRadius
      });

      var mousedown = false;

      el.on("mousedown", function(event) {
        mousedown = true;

        marker.css({
          top: event.pageY - el.offset().top - markerRadius,
          left: event.pageX - el.offset().left - markerRadius,
        });
      });

      el.on("mousemove", function(event) {
        if (mousedown) {  
          var topOffset = event.pageY - el.offset().top;
          var leftOffset = event.pageX - el.offset().left;

          if (event.pageY - el.offset().top < 0) {
            topOffset = 0;
          } 

          if (event.pageY - el.offset().top > parseInt(options.height)) {
            topOffset = parseInt(options.height);
          }

          if (event.pageX - el.offset().left < 0) {
            leftOffset = 0;
          }

          if (event.pageX - el.offset().left > parseInt(options.width)) {
            leftOffset = parseInt(options.width);
          }

          marker.css({
            top: topOffset - markerRadius,
            left: leftOffset - markerRadius,
          });
        }
      });

      $(document).on("mouseup", function(event) {
        mousedown = false;

        marker.css({
          top: parseInt(options.height) / 2 - markerRadius,
          left: parseInt(options.width) / 2 - markerRadius
        });
      });
    });
  }
})(jQuery);
