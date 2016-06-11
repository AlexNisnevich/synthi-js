/**
 * *Heavily* tweaked by Alex and Jacob Nisnevich from ...
 *
 * @name		jQuery KnobKnob plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/11/pretty-switches-css3-jquery/
 * @license		MIT License
 */

if (!localStorage['knobs.motion']) {
	localStorage['knobs.motion'] = 'radial'; // radial, vertical, or hybrid
}
if (!localStorage['knobs.intensity']) {
	localStorage['knobs.intensity'] = '1.0'; // radial, vertical, or hybrid
}

(function($){
	
	$.fn.knobKnob = function(props){
	
		var options = $.extend({
			snap: 0,
			value: 0,
			diameter: 83,
			color: 'black',
			min: 0,
			max: 100,
			label: 'Knob',
			startOffset: 30,
			endOffset: 30,
			turn: function() {}
		}, props || {});
	
		var tpl =  '<div class="knob-label">' + options.label + '</div>\
					<div class="knob-container">\
						<div class="knob radial metal">\
							<div class="knob-dot"></div>\
						</div>\
					</div>';
	
		return this.each(function(){
			var el = $(this);
			el.append(tpl);
			
			var knob = $('.knob', el),
				knobContainer = $('.knob-container', el),
				knobLabel = $('.knob-label', el),
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
				'height': knobDiameter + 'px',
				'width': knobDiameter + 'px'
			}).addClass(options.color);

			knobContainer.css({
				'height': knobDiameter + 'px',
				'width': knobDiameter + 'px'
			});

			knobLabel.css('top', (48-knobDiameter/2) + 'px');

			rotation = lastDeg = currentDeg = Math.max(startOffset, options.value);

			function set(deg) {
				knob.css('transform','rotate(' + deg + 'deg)');
				knob.attr("data-value", deg);
				options.turn((deg - startOffset) / (360 - startOffset - endOffset) * (knobMax - knobMin) + knobMin);
			}
			knob.data("set", set);
			set(currentDeg);

			var mouseOverKnob = false;
			knob.mouseenter(function() { mouseOverKnob = true; rotation = currentDeg; })
				.mouseleave(function() { mouseOverKnob = false; rotation = currentDeg; });

			knob.on('mousedown touchstart', function(e){
				var originalOffsetY = e.offsetY;

				e.preventDefault();
			
				var offset = knob.offset();
				var center = {
					y: offset.top + knob.height()/2,
					x: offset.left + knob.width()/2
				};
				
				var a, b, deg, tmp,
					rad2deg = 180/Math.PI;
				
				$(document).on('mousemove.rem touchmove.rem',function(e){
					e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;
					
					if (localStorage['knobs.motion'] == 'radial' || (localStorage['knobs.motion'] == 'hybrid' && mouseOverKnob)) {
						// Inside the knob = skeuomorphic knob behavior (radial)

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

						var delta = (deg - startDeg) * parseFloat(localStorage['knobs.intensity'])

						// Calculating the current rotation
						var tmp = Math.floor(delta + rotation);
					} else if (localStorage['knobs.motion'] == 'vertical' || (localStorage['knobs.motion'] == 'hybrid' && !mouseOverKnob)) {
						// Outside the knob = Ableton behavior (vertical)

						var rawDelta = (offset.top + originalOffsetY - e.pageY) / $(document).height() * 100; // 1 deg for each 1% of the page vertically
						rawDelta *= parseFloat(localStorage['knobs.intensity']);
						var multiplier = Math.max(Math.log(Math.abs(rawDelta)) * 2, 1);
						var delta = rawDelta * multiplier;

						var tmp = Math.floor(rotation + delta);
					}

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

					currentDeg = Math.max(currentDeg, startOffset);
					currentDeg = Math.min(currentDeg, 360 - endOffset);
		
					knob.css('transform','rotate(' + currentDeg + 'deg)');
					knob.attr("data-value", currentDeg);
					options.turn((currentDeg - startOffset) / (360 - startOffset - endOffset) * (knobMax - knobMin) + knobMin);
				});
			
				doc.on('mouseup.rem touchend.rem',function() {
					knob.off('.rem');
					doc.off('.rem');
					
					// Saving the current rotation
					rotation = currentDeg;
					
					// Marking the starting degree as invalid
					startDeg = -1;
				});
			
			});

			knob.bind('mousewheel DOMMouseScroll', function(e) {
				e.preventDefault();
				var ori = e.originalEvent;

				deg = 0;

				if (ori.wheelDeltaX > 0 || ori.wheelDeltaY > 0 || ori.detail > 0) {
					deg = 0.5 * parseFloat(localStorage['knobs.intensity']);
				} else if (ori.wheelDeltaX < 0 || ori.wheelDeltaY < 0 || ori.detail < 0) {
					deg = -0.5 * parseFloat(localStorage['knobs.intensity']);
				}

				rotation = deg + rotation;
				rotation = Math.max(rotation, startOffset);
				rotation = Math.min(rotation, 360 - endOffset);
				set(rotation);
			});
		});
	};
	
})(jQuery);
