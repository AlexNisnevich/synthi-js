var Vco1sin = new Component(["I"], 1, {
  ugen: "flock.ugen.sinOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-I",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
    }
  },
  mul: 0.3
});

var Vco1ramp = new Component(["I"], 2, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-I",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
    }
  },
  options: {
    interpolation: "linear"
  },
  mul: 0
});

var Vco2square = new Component(["J"], 3, {
  ugen: "flock.ugen.squareOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 440,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-J",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
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
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-J",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
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
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-K",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
    }
  },
  mul: 0.4
});

var Vco3triangle = new Component(["K"], 6, {
  ugen: "flock.ugen.triOsc",
  freq: {
    ugen: "flock.ugen.value",
    rate: "audio",
    value: 1,
    mul: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 2,
        pow: {
          id: "input-K",
          ugen: "flock.ugen.in",
          add: 0
        }
      }
    }
  },
  mul: 0
});
