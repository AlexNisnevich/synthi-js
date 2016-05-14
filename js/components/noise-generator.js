var NoiseGenerator = new Component([], 7, {
  ugen: "flock.ugen.filter.biquad.bp",
  source: {
    ugen: "flock.ugen.whiteNoise",
    mul: 0.3
  },
  freq: 440,
  q: 2.0
});
