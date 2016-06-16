var JoystickX = new Component([], 15, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      ugen: "flock.ugen.mouse.cursor",
      add: -0.5,
      mul: 1,
      options: {
        axis: "x",
        target: "#joystick"
      }
    },
    mul: {
      ugen: "flock.ugen.mouse.click",
      options: {
        target: "#joystick"
      },
      mul: 1
    }
  }
});

var JoystickY = new Component([], 16, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      ugen: "flock.ugen.mouse.cursor",
      add: 0.5,
      mul: -1,
      options: {
        axis: "y",
        target: "#joystick"
      }
    },
    mul: {
      ugen: "flock.ugen.mouse.click",
      options: {
        target: "#joystick"
      },
      mul: 1
    }
  }
});
