var KeyboardVco1 = new Component([], 8, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: 440,
  options: {
    interpolation: "linear"
  },
  mul: 0,
  add: 0
});

var KeyboardVco2 = new Component([], 9, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: 440,
  options: {
    interpolation: "linear"
  },
  mul: 0,
  add: 0
});
