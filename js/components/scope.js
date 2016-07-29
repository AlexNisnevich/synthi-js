var Scope = new Component(["A"], 0, {
  ugen: "flock.ugen.scope",
  source: {
    id: "input-A",
    ugen: "flock.ugen.in",
    mul: 1/6  // up to 6V p-p input -> 1V p-p scope output
  },
  options: {
    canvas: gfx,
    //fps: 30,
    styles: {
      strokeColor: "#777777",
      strokeWidth: 2
    }
  }
});
