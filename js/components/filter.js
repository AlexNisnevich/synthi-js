var FilterOscillator = new Component(["H", "N"], 10, {
  ugen: "flock.ugen.filter.moog",
  cutoff: {
    ugen: "flock.ugen.value",
    value: 10000,
    mul: {
      id: "input-N",
      ugen: "flock.ugen.in",
      add: 1,
      mul: 1/6
    }
  },
  resonance: 0,
  source: {
    id: "input-H",
    ugen: "flock.ugen.in"
  },
  mul: 0.5
});
