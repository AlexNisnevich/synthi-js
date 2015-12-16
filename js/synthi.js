var environment = flock.init({
  numBuses: 32
});

environment.start();

var buses = {
  0: 19,  // (unused bus)
  3: 3,
  4: 5,
  5: 7,
  7: 11,
  12: 13,
  13: 15,
  14: 17
}

var components = [];

function Component(inputPins, outputPin, synthDef) {
  this.init = function () {
    this.inputPins = inputPins;
    this.connectedPins = [];

    if (synthDef.id === undefined) { synthDef.id = "main"; }

    var enclosingDef = {
      ugen: "flock.ugen.out",
      sources: synthDef
    };

    if (outputPin !== null) { enclosingDef.bus = buses[outputPin]; }

    this.synth = flock.synth({
      synthDef: enclosingDef
    });

    components.push(this);
  };

  this.set = function (property, value) {
    this.synth.set("main."+property, value);
  };

  this.connect = function (inputPin, connectedPins) {
    this.connectedPins = connectedPins;
    var inputBuses = connectedPins.map(function (p) {return buses[p];});

    this.synth.set("input-"+inputPin+".bus", inputBuses);
    this.moveToFront();
  };

  this.moveToFront = function () {
    environment.remove(this.synth);
    environment.tail(this.synth);

    components.filter(function (c) {return c.connectedPins.indexOf(outputPin) > -1})
      .forEach(function (c) {c.moveToFront();});
  }

  this.init();
}
