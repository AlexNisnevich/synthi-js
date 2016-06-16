var KeyboardVco = new Component([], 8, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: 440,
  options: {
    interpolation: "linear"
  },
  mul: 0
});
