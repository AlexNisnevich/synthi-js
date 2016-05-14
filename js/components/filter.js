var FilterOscillator = new Component(["H", "N"], 10, {
  ugen: "flock.ugen.filter.moog",
  cutoff: 10000,
  resonance: 0,
  source: {
    id: "input-H",
    ugen: "flock.ugen.in"
  },
  mul: 0.5
});
