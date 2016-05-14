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
