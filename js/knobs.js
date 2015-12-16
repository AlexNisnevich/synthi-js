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
      Vco3square.set("freq", v); 
      Vco3triangle.set("freq", v); 
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
      Vco3square.set("mul", v * 4 / 10); 
    }
  });

  $(".dialOsc3TriangleLevel").knob({
    'change': function (v) { 
      Vco3triangle.set("mul", v * 6 / 10); 
    }
  });

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
});
