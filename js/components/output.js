var Output = new Component(["A", "C"], null, [{
  id: "left",
  ugen: "flock.ugen.filter.biquad.bp",
  freq: 440,
  q: 4,
  source: {
    ugen: "flock.ugen.math",
    inputs: {
      source: {
        id: "left1",
        ugen: "flock.ugen.math",
        source: {
          id: "input-A1",
          ugen: "flock.ugen.in",
          mul: 1
        },
        mul: 1
      },
      add: {
        id: "left2",
        ugen: "flock.ugen.math",
        source: {
          id: "input-C1",
          ugen: "flock.ugen.in",
          mul: 0
        },
        mul: 1
      }
    }
  }
},{
  id: "right",
  ugen: "flock.ugen.filter.biquad.bp",
  freq: 440,
  q: 4,
  source: {
    ugen: "flock.ugen.math",
    inputs: {
      source: {
        id: "right1",
        ugen: "flock.ugen.math",
        source: {
          id: "input-A2",
          ugen: "flock.ugen.in",
          mul: 0
        },
        mul: 1
      },
      add: {
        id: "right2",
        ugen: "flock.ugen.math",
        source: {
          id: "input-C2",
          ugen: "flock.ugen.in",
          mul: 1
        },
        mul: 1
      }
    }
  }
}]);
Output.connect = function (inputPin, connectedPins) {
  this.connectedPins = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});

  this.synth.set("input-"+inputPin+"1.bus", inputBuses);
  this.synth.set("input-"+inputPin+"2.bus", inputBuses);
  this.moveToFront();
};
Output.set = function (property, value) {
  this.synth.set(property, value);
};
