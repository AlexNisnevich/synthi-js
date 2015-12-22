$(function () {
  // Patchboard

  $("#patches input").change(function () {
    connectPin($(this));
  });

  // Oscillator 1

  $("#osc1Freq").knobKnob({
    min: 40,
    max: 10000,
    value: 16,
    diameter: 100,
    label: 'frequency',
    color: 'green',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco1sin.set("freq.value", v);
      Vco1ramp.set("freq.value", v);
    }
  });

  $("#osc1Shape").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'shape',
    color: "blue",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco1sin.set("table", tables.sin(v));
    }
  });

  $("#osc1SinLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'sin level',
    value: 30,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      Vco1sin.set("mul", v * 3 / 10);  // up to 3V p-p output
    }
  });

  $("#osc1RampLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'ramp level',
    value: 0,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco1ramp.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  // Oscillator 2

  $("#osc2Freq").knobKnob({
    min: 40,
    max: 10000,
    value: 16,
    diameter: 100,
    label: 'frequency',
    color: "green",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco2square.set("freq.value", v);
      Vco2triangle.set("freq.value", v);
    }
  });

  $("#osc2Shape").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'shape',
    color: "blue",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      Vco2square.set("table", tables.square(v));
      Vco2triangle.set("table", tables.triangle(v));
    }
  });

  $("#osc2SquareLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'squ level',
    value: 30,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      Vco2square.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  $("#osc2TriangleLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'tri level',
    value: 0,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco2triangle.set("mul", v * 6 / 10);  // up to 6V p-p output
    }
  });

  // Oscillator 3

  $("#osc3Freq").knobKnob({
    min: 0.5,
    max: 500,
    value: 0,
    diameter: 100,
    label: 'frequency',
    color: "green",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco3square.set("freq.value", v);
      Vco3triangle.set("freq.value", v);
    }
  });

  $("#osc3Shape").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'shape',
    color: "blue",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      Vco3square.set("table", tables.square(v));
      Vco3triangle.set("table", tables.triangle(v));
    }
  });

  $("#osc3SquareLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'squ level',
    value: 30,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      Vco3square.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  $("#osc3TriangleLevel").knobKnob({
    min: 0,
    max: 10,
    diameter: 70,
    label: 'tri level',
    value: 0,
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Vco3triangle.set("mul", v * 6 / 10);  // up to 6V p-p output
    }
  });

  // Noise Generator

  $("#noiseLevel").knobKnob({
    min: 0,
    max: 10,
    value: 30,
    diameter: 70,
    label: 'level',
    color: 'blue',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      NoiseGenerator.set("source.mul", v * 3 / 10);  // up to 3V p-p output
    }
  });

  $("#noiseShape").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'shape',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      NoiseGenerator.set("freq", 440 * Math.pow(2, v - 5));  // modulate filter frequency to simulate colored noise
    }
  });

  // Filter / Oscillator

  $("#filterFrequency").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'frequency',
    color: 'blue',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      FilterOscillator.set("cutoff", 440 * Math.pow(2, v - 5) + 80);
    }
  });

  $("#filterResponse").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'response',
    color: 'yellow',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      FilterOscillator.set("resonance", v * 4 / 10);  // 0-4 scale (4 = self-oscillation)
    }
  });

  $("#filterLevel").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'level',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      FilterOscillator.set("mul", v / 10);
    }
  });

  // Envelope Shaper

  $("#envAttack").knobKnob({
    min: 0.01,
    max: 1,
    value: 30,
    diameter: 70,
    label: 'attack',
    color: "red",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      EnvelopeShaper.set("attack", v);
      EnvelopeTrapezoid.set("attack", v);
    }
  });

  $("#envOn").knobKnob({
    min: 0,
    max: 2.5,
    value: 90,
    diameter: 70,
    label: 'on',
    color: "red",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      EnvelopeShaper.set("on", v);
      EnvelopeTrapezoid.set("on", v);
    }
  });

  $("#envDecay").knobKnob({
    min: 0.01,
    max: 15,
    value: 30,
    diameter: 70,
    label: 'decay',
    color: "red",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      EnvelopeShaper.set("release", v);
      EnvelopeTrapezoid.set("release", v);
    }
  });

  $("#envOff").knobKnob({
    min: 0.01,
    max: 10,
    value: 30,
    diameter: 70,
    label: 'off',
    color: "red",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      EnvelopeShaper.set("off", v);
      EnvelopeTrapezoid.set("off", v);
    }
  });

  $("#envTrapezoidLevel").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'trapezoid lvl',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      // max: -3V to +4V
      EnvelopeTrapezoid.synth.set("main.source.mul", v * 7/10);
      EnvelopeTrapezoid.synth.set("main.add", - v * 4/10);
    }
  });

  $("#envSignalLevel").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'signal lvl',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      EnvelopeShaper.synth.set("main.mul", v/10);
    }
  });

  // Ring Modulator

  $("#ringModLevel").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'level',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      RingModulator.set("source.mul", v / 10);
    }
  });

  // Reverb

  $("#reverbMix").knobKnob({
    min: 0,
    max: 10,
    value: 90,
    diameter: 70,
    label: 'mix',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      Reverb.set("mix", v / 10);
    }
  });

  $("#reverbLevel").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'level',
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      JoystickX.set("source.mul", v / 5);  // up to 2V p-p
      JoystickX.set("source.add", - v / 10); 
    }
  });

  $("#joystickXRange").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'x',
    color: "green",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) { 
      JoystickX.set("source.mul", v / 5);  // up to 2V p-p
      JoystickX.set("source.add", - v / 10); 
    }
  });

  $("#joystickYRange").knobKnob({
    min: 0,
    max: 10,
    value: 150,
    diameter: 70,
    label: 'y',
    color: "green",
    startOffset: 30,
    endOffset: 30,
    turn: function (v) {
      JoystickY.set("source.mul", - v / 5);  // up to 2V p-p
      JoystickY.set("source.add", v / 10); 
    }
  });

  // Set up masonry grid layout and fade in

  $('.grid').masonry({
    columnWidth: '.width1',
    itemSelector: '.panel'
  }).css("visibility", "visible")
    .hide()
    .fadeIn();
});
