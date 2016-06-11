var environment = flock.init({
  numBuses: 48
});

environment.start();

var buses = {
  0: 39,  // (unused bus)
  1: 31,
  2: 33,
  3: 3,
  4: 5,
  5: 7,
  6: 9,
  7: 11,
  8: 13,
  9: 15,
  10: 17,
  11: 19,
  12: 21,
  13: 23,
  14: 25,
  15: 27,
  16: 29
}

var components = [];

var currentBank = 0;

function Component(inputPins, outputPin, synthDef) {
  if (synthDef.id === undefined) { synthDef.id = "main"; }
  var enclosingDef = {
    id: "output",
    ugen: "flock.ugen.out",
    sources: synthDef
  };
  if (outputPin !== null) { enclosingDef.bus = buses[outputPin]; }

  this.init = function () {
    this.inputPins = inputPins;
    this.connectedPins = {};

    this.synth = flock.synth({
      synthDef: enclosingDef
    });

    components.push(this);
  };

  this.restart = function () {
    this.synth.destroy();

    this.synth = flock.synth({
      synthDef: enclosingDef
    });

    this.moveToFront();
  };

  this.getAllConnectedPins = function () {
    var allConnectedPins = [];
    for (inputPin in this.connectedPins) {
      allConnectedPins = allConnectedPins.concat(this.connectedPins[inputPin]);
    }
    return allConnectedPins;
  }

  this.set = function (property, value) {
    this.synth.set("main."+property, value);
  };

  this.connect = function (inputPin, connectedPins) {
    this.connectedPins[inputPin] = connectedPins;
    var inputBuses = connectedPins.map(function (p) {return buses[p];});

    this.synth.set("input-"+inputPin+".bus", inputBuses);
    this.moveToFront();
  };

  this.moveToFront = function () {
    environment.remove(this.synth);
    environment.tail(this.synth);

    components.filter(function (c) {return c.getAllConnectedPins().indexOf(outputPin) > -1})
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

function disconnectAllPins() {
  $("#patches input").each(function (i, pin) {
    if ($(pin).is(':checked')) {
      $(pin).prop('checked', false);
      connectPin($(pin));
    }
  });
}

function saveState() {
  var dialValues = {};
  $(".dial").each(function (i, x) { 
    dialValues[$(x).attr("id")] = parseInt($(".knob", x).attr("data-value")); 
  });

  var pinValues = {};
  $("#patches input").each(function (i,x) {
    if ($(x).is(':checked')) {
      pinValues[$(x).attr("data-in") + "-" + $(x).attr("data-out")] = true
    }
  });

  return LZString.compressToBase64(JSON.stringify({
    dials: dialValues,
    pins: pinValues
  }));
}

function loadState(state) {
  console.log("Loading " + state + " ...");
  var parsed = JSON.parse(LZString.decompressFromBase64(state));

  // Dials
  var dials = parsed.dials;
  for (dialName in dials) {
    var dialValue = dials[dialName];
    ($(".dial#" + dialName + " .knob").data("set"))(dialValue);
  }

  // Pins
  var pins = parsed.pins;
  disconnectAllPins(); // reset state of patchboard first!
  for (pinName in pins) {
    var pinIn = pinName.split("-")[0];
    var pinOut = pinName.split("-")[1];
    var checked = pins[pinName];

    if (checked) {
      var pin = $("#patches input[data-in="+pinIn+"][data-out="+pinOut+"]");
      pin.prop('checked', true);
      connectPin(pin);
    }
  }
}

function refreshState() {
  loadState(saveState());  // Used after manually triggering Envelope to clean up state.
}

function storeToBank() {
  localStorage["bank" + currentBank] = saveState();
}

function loadFromBank() {
  loadState(presetBanks[currentBank] || localStorage["bank" + currentBank]);
}

function clearBank() {
  localStorage.removeItem("bank" + currentBank);
}

