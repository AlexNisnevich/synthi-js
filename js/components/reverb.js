var Reverb = new Component(["G", "M"], 14, {
  ugen: "flock.ugen.freeverb",
  inputs: {
    source: {
      id: "input-G",
      ugen: "flock.ugen.in"
    },
    mix: {
      ugen: "flock.ugen.value",
      value: 0.5,
      add: {
        id: "input-M",
        ugen: "flock.ugen.in",
        mul: 1/6
      }
    },
    room: 0.84,
    damp: 0.2,
    mul: 0.5
  }
});