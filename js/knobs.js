$(function () {
  // Oscillator 1

  $(".dialOsc1Freq").knob({
    'change': function (v) { 
      Vco1sin.set("freq.value", v);
      Vco1ramp.set("freq.value", v);
    }
  });

  $(".dialOsc1Shape").knob({
    'change': function (v) { 
      Vco1sin.set("table", tables.sin(v)); 
    }
  });

  $(".dialOsc1SinLevel").knob({
    'change': function (v) { 
      Vco1sin.set("mul", v * 3 / 10);  // up to 3V p-p output
    }
  });

  $(".dialOsc1RampLevel").knob({
    'change': function (v) { 
      Vco1ramp.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  // Oscillator 2

  $(".dialOsc2Freq").knob({
    'change': function (v) { 
      Vco2square.set("freq.value", v); 
      Vco2triangle.set("freq.value", v); 
    }
  });

  $(".dialOsc2Shape").knob({
    'change': function (v) { 
      Vco2square.set("table", tables.square(v));
      Vco2triangle.set("table", tables.triangle(v));
    }
  });

  $(".dialOsc2SquareLevel").knob({
    'change': function (v) { 
      Vco2square.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  $(".dialOsc2TriangleLevel").knob({
    'change': function (v) { 
      Vco2triangle.set("mul", v * 6 / 10);  // up to 6V p-p output
    }
  });

  // Oscillator 3

  $(".dialOsc3Freq").knob({
    'change': function (v) { 
      Vco3square.set("freq.value", v); 
      Vco3triangle.set("freq.value", v); 
    }
  });

  $(".dialOsc3Shape").knob({
    'change': function (v) { 
      Vco3square.set("table", tables.square(v));
      Vco3triangle.set("table", tables.triangle(v));
    }
  });

  $(".dialOsc3SquareLevel").knob({
    'change': function (v) { 
      Vco3square.set("mul", v * 4 / 10);  // up to 4V p-p output
    }
  });

  $(".dialOsc3TriangleLevel").knob({
    'change': function (v) { 
      Vco3triangle.set("mul", v * 6 / 10);  // up to 6V p-p output
    }
  });

  // Noise Generator

  $(".dialNoiseLevel").knob({
    'change': function (v) { 
      NoiseGenerator.set("source.mul", v * 3 / 10);  // up to 3V p-p output
    }
  });

  $(".dialNoiseShape").knob({
    'change': function (v) { 
      NoiseGenerator.set("freq", 440 * Math.pow(2, v - 5));  // modulate filter frequency to simulate colored noise
    }
  });

  // Filter / Oscillator

  $(".dialFilterFrequency").knob({
    'change': function (v) { 
      FilterOscillator.set("cutoff", 440 * Math.pow(2, v - 5) + 80);
    }
  });

  $(".dialFilterResponse").knob({
    'change': function (v) { 
      FilterOscillator.set("resonance", v * 4 / 10);  // 0-4 scale (4 = self-oscillation)
    }
  });

  $(".dialFilterLevel").knob({
    'change': function (v) { 
      FilterOscillator.set("mul", v / 10);
    }
  });

  // Envelope Shaper

  $(".dialEnvAttack").knob({
    'change': function (v) { 
      EnvelopeShaper.set("attack", v);
    }
  });

  $(".dialEnvOn").knob({
    'change': function (v) { 
      EnvelopeShaper.set("on", v);
    }
  });

  $(".dialEnvDecay").knob({
    'change': function (v) { 
      EnvelopeShaper.set("release", v);
    }
  });

  $(".dialEnvOff").knob({
    'change': function (v) { 
      EnvelopeShaper.set("off", v);
    }
  });

  // Ring Modulator

  $(".dialRingModLevel").knob({
    'change': function (v) {
      RingModulator.set("source.mul", v / 10);
    }
  });

  // Reverb

  $(".dialReverbMix").knob({
    'change': function (v) {
      Reverb.set("mix", v / 10);
    }
  });

  $(".dialReverbLevel").knob({
    'change': function (v) {
      Reverb.set("mul", v / 10);
    }
  });
});
