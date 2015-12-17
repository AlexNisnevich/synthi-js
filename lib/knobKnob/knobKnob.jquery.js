/**
 * @name		jQuery KnobKnob plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/11/pretty-switches-css3-jquery/
 * @license		MIT License
 */

(function($){
	
	$.fn.knobKnob = function(props){
	
		var options = $.extend({
			snap: 0,
			value: 0,
			diameter: '83px',
			color: 'black',
			min: 0,
			max: 100,
			label: 'Knob',
			startOffset: 30,
			endOffset: 30,
			turn: function() {}
		}, props || {});
	
		var tpl = '<div class="knob-container">\
				<div class="knob radial metal">\
				<div class="knob-dot"></div>\
				</div>\
				<div class="knob-label">' + options.label + '</div>\
			</div>';
	
		return this.each(function(){
			
			var el = $(this);
			el.append(tpl);
			
			var knob = $('.knob', el),
				knobContainer = $('.knob-container', el),
				knobDiameter = options.diameter,
				knobMin = options.min,
				knobMax = options.max,
				startOffset = options.startOffset,
				endOffset = options.endOffset,
				startDeg = -1,
				currentDeg = 0,
				rotation = 0,
				lastDeg = 0,
				doc = $(document);

			knob.css({
				'height': knobDiameter,
				'width': knobDiameter
			});

			knobContainer.css({
				'width': knobDiameter
			})
			
			if (options.value >= 0 && options.value <= 360){
				rotation = lastDeg = currentDeg = options.value;

				var adjustedForOffset = currentDeg + startOffset;
				knob.css('transform','rotate(' + adjustedForOffset + 'deg)');
				options.turn(Math.round(((adjustedForOffset - startOffset) / (360 - endOffset)) * (knobMax - knobMin) + knobMin));
			}
			
			knob.on('mousedown touchstart', function(e){
			
				e.preventDefault();
			
				var offset = knob.offset();
				var center = {
					y: offset.top + knob.height()/2,
					x: offset.left + knob.width()/2
				};
				
				var a, b, deg, tmp,
					rad2deg = 180/Math.PI;
				
				knob.on('mousemove.rem touchmove.rem',function(e){
					
					e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;
					
					a = center.y - e.pageY;
					b = center.x - e.pageX;
					deg = Math.atan2(a,b)*rad2deg;
					
					// we have to make sure that negative
					// angles are turned into positive:
					if (deg < 0) {
						deg = 360 + deg;
					}
					
					// Save the starting position of the drag
					if (startDeg == -1) {
						startDeg = deg;
					}
					
					// Calculating the current rotation
					tmp = Math.floor((deg-startDeg) + rotation);
					
					// Making sure the current rotation
					// stays between 0 and 359
					if (tmp < 0) {
						tmp = 360 + tmp;
					} else if (tmp > 359) {
						tmp = tmp % 360;
					}
					
					// Snapping in the off position:
					if (options.snap && tmp < options.snap) {
						tmp = 0;
					}
					
					// This would suggest we are at an end position;
					// we need to block further rotation.
					if (Math.abs(tmp - lastDeg) > 180) {
						return false;
					}
					
					currentDeg = tmp;
					lastDeg = tmp;

					var adjustedForOffset = currentDeg + startOffset;
					if (adjustedForOffset > (360 - endOffset)) {
						return false
					}
		
					knob.css('transform','rotate(' + adjustedForOffset + 'deg)');
					options.turn(Math.round(((adjustedForOffset - startOffset) / (360 - endOffset)) * (knobMax - knobMin) + knobMin));
				});
			
				doc.on('mouseup.rem  touchend.rem',function() {
					knob.off('.rem');
					doc.off('.rem');
					
					// Saving the current rotation
					rotation = currentDeg;
					
					// Marking the starting degree as invalid
					startDeg = -1;
				});
			
			});
		});
	};
	
})(jQuery);