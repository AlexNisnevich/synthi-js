
var Output = new Component(["A", "C"], null, [{
  id: "input-A",
  ugen: "flock.ugen.in",
}, {
  id: "input-C",
  ugen: "flock.ugen.in"
}]);

var Scope = new Component(["B"], 0, {
  ugen: "flock.ugen.scope",
  source: {
    id: "input-B",
    ugen: "flock.ugen.in",
    mul: 1/6  // up to 6V p-p input -> 1V p-p scope output
  },
  options: {
    canvas: gfx,
    styles: {
      strokeColor: "#777777",
      strokeWidth: 2
    }
  }
});

var Vco1sin = new Component(["I"], 3, {
  ugen: "flock.ugen.sinOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      id: "input-I",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  mul: 0.3
});

var Vco1ramp = new Component(["I"], 3, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      id: "input-I",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  options: {
    interpolation: "linear"
  },
  mul: 0
});

var Vco2square = new Component(["J"], 4, {
  ugen: "flock.ugen.squareOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      id: "input-J",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  mul: 0.4
});

var Vco2triangle = new Component(["J"], 4, {
  ugen: "flock.ugen.triOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      id: "input-J",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  mul: 0
});

var Vco3square = new Component(["K"], 5, {
  ugen: "flock.ugen.squareOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 1,
    mul: {
      id: "input-K",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  mul: 0.4
});

var Vco3triangle = new Component(["K"], 5, {
  ugen: "flock.ugen.triOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 1,
    mul: {
      id: "input-K",
      ugen: "flock.ugen.in",
      add: 1
    }
  },
  mul: 0
});

var NoiseGenerator = new Component([], 7, {
  ugen: "flock.ugen.filter.biquad.bp",
  source: {
    ugen: "flock.ugen.whiteNoise",
    mul: 0.3
  },
  freq: 440,
  q: 2.0
});

var EnvelopeShaper = new Component(["D"], 12, {
  id: "input-D",
  ugen: "flock.ugen.in",
  mul: {
    id: "env",
    ugen: "flock.ugen.asr",
    start: 0.0,
    attack: 0.01,
    sustain: 1.0,
    on: 1.0,
    release: 1.0,
    off: 1.0,
    gate: {
      ugen: "flock.ugen.lfPulse",
      rate: "control",
      freq: (1 / 3.01) * 2,
      width: 0.5
    }
  }
});
EnvelopeShaper.set = function (property, value) {
  this.synth.set("env."+property, value);

  var totalTime = this.synth.get("env.attack") + this.synth.get("env.on") + this.synth.get("env.release") + this.synth.get("env.off");
  var attackTime = this.synth.get("env.attack") + this.synth.get("env.on")

  this.synth.set("env.gate.freq", 1 / totalTime);
  this.synth.set("env.gate.width", attackTime / totalTime);
};

var RingModulator = new Component(["E", "F"], 13, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "input-E",
      ugen: "flock.ugen.in",
      mul: 0.5
    },
    mul: {
      id: "input-F",
      ugen: "flock.ugen.in"
    }
  }
});



