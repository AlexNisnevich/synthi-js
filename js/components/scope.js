var Scope = new Component(["B"], 0, {
  ugen: "flock.ugen.scope",
  source: {
    id: "input-B",
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
