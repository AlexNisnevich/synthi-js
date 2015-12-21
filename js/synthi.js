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
  10: 13,
  12: 15,
  13: 17,
  14: 19
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

function connectPin(pin) {
  var inputPin = pin.attr("data-in");
  var outputPin = pin.attr("data-out");

  var allConnectionsToInput = $("#patches [data-in="+inputPin+"]:checked").map(function (i, x) {return parseInt($(this).attr("data-out"));}).get();
  console.log("Hooking up [" + allConnectionsToInput + "] to " + inputPin);

  try {
    components.filter(function (c) {return c.inputPins.indexOf(inputPin) > -1;})
      .forEach(function (c) {c.connect(inputPin, allConnectionsToInput)});
  } catch (e) {
    // disconnect
    pin.attr("checked", false);

    // this was probably caused by a circular dependency issue (TODO: just disable pins that could cause circular dependencies)
    if (e.message.indexOf("Maximum call stack size exceeded") > -1) {
      throw "Circular dependency";
    } else {
      throw e;
    }
  }
}
