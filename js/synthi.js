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

var presetBanks = {
  // Crashing waves
  95: "N4IgJglghgNgziAXKAZhGAXApgJwGI5YCOArlgHYDGAnkgIwAcADADQhqa4BKWcADgHtycLPWZsO2HABksANywwxrEDgjkA5gFkBYWQqWIAzEZUC4lOgWL0ArABY25ywGUAFlD6jEjMxbou6vqKSEYATLZO/lxQALZ8wYYmKhRyAIIYGFCUANb0RgDsbKkA8uRIAJwp5HIAIliUULSIAGzVciUoKEj27QAqOJ5YAF4CEHryIcZhRSCpgRrksImhplGUYdZEyuth7kM7IM57pFCEK61+GwPQmjBYF2uqkzgARloQAB6hTEZshAo3o8ns4jFskAUwusjPsvIdQS5TudJoY2tCblA7g8UT82JQ3HR1HwSBgLr48W4wkSSWTxCByGMRLDvOT6YzsQZVip8XQBCTiRg8OgpId8WE+RgBULODhDgArATUOAYCC5AAaMU03mSbAVSpVuQAmpqNNqnjz7pzptyCXxMbiQGK7eVjEwbWFLVNWdhlbVoIZfABfNh8dQIZAgACiAFo6EgMDgyGwY2F44msGwAJLR2xppMgaQ5vMZkB4aMFYtsABCsbjiAT+bSsdT9fT1eblZAAHFY0ZO7VY/ZO9m6LnW/mANKxlrFwOBoA=",
  
  // Telephone signal sound (control with joystick)
  96: "N4IgJglghgNgziAXKAZhGAXApgJwGI5YCOArlgHYDGAnkgIwAcADADQhqa4BKWcADgHtycLPWZsO2HABksANywwxrEDgjkA5gFkBYWQqWJGKgXEp0CxZW1PmAygAsofUUfEhbdO+v2KkANhMzOi4oAFs+X0MAZhUKOQBBDAwoSgBrALjyOQB5ciQATiy5ABEsSihaREC2eJyUFEza7IAVHGcsAC8BCD15Pzdi7w1yWCjrDzMAJksiCdspxw76fwYbabtSKEJx6qDKKbboTRgsXdi2QgUcACMtCAAPQpUr3Bvd43XKaNn5s2ili4/t9NiRtmd+oYapNvkcoCcIQYkBcQJQHHR1HwSBgPu40VNMdjcSpyD0RIDXJ8QKSICJdtC0XQBNisRg8OgpBN8cyMKz2ZwcBMAFYCahwDAQdIADVCmkp7hFYol6QAmrKNPKVIzTkjBmxGXx4citQ4pob8ohYiapjqBlTsOKStBDMYAL5sPjqBDIEAAUQAtHQkBgcGQ2Hh/dFg6GsGwAJL+gCs0bDIASgajiBDqYAQhmU7GQABpQPJrMxtgAKUD/gLrtdQA",
  
  // Overtone bell (based on Ex 4 in SYNTHI A Manual)
  97: "N4IgJglghgNgziAXKAZhGAXApgJwGI5YCOArlgHYDGAnkgEwCsDANCGprgEpZwAOA9uThYkAZgAMLNumw4AMlgBuWGGImscEcgHMAsvzALlqxKLp1W/OJQCMBYvQBsNy9ZsBlABZReIxDYAOcVdbdy0jFTFxYJArW04oAFteCJN1EApFAEEMDChKAGskRxjMgHlyJAAWAHZWTIARLEooWkQg+vJFMpQUapcMroAVHB8sAC9+CEMlSP8OwcUw7XJYVLUYuLp7InoGAa2vMaRAzes6d1IoQnXTM8o6EegdGCxbiVENWZwAI10IAAeGy+yl+7zon1i1lEO2KVRCoiOvhOCziiKuN1mJhKCKeUBebyxUVYlE8Ni0vBIGFupxJnjoFKpNIW5CmwiRflpIFZEGEtxxIFJNn4VMpGDwMlwKJipLoIowYolHBw0tYACt+NQ4BgIIUABoJHSchYarU6woATUN2mNMrJr2MqsFZN4+OJzrorsqdztdAdcy52G1DWgJlOAF9WLwtAhkCAAKIAWhsSAwODIrDwiaqqfTWFYDWT4lzGZAAHFk3QS/mQAAJZOiausLLJnOINOlgBCrer4fDQA=",
  
  // Bowing effect (make sound with joystick, based on Ex 12 in SYNTHI A Manual)
  98: "N4IgJglghgNgziAXKAZhGAXApgJwGI5YCOArlgHYDGAnkgIwAcADADQhqa4BKWcADgHtycLPWZsO2HABksANywwxrEDgjkA5gFkBYWQqWIAzEZUC4lOgWL0ArAE425ywGUAFlD6jEjMxbou6vqKSEZ0jiDOdFxQALZ8wYambBRyAIIYGFCUANZIAGwqqQDy5Ej2ReRyACJYlFC0iIUpVcUoKAWVcgAqOJ5YAF4CEHryIT7iIKmBGuSwicpOFgBM1kSLkSvu/RvOyy6kUIQLTX6Uy73QmjBYJ8mqYzgARloQAB70+UZshArPd/dnEY1rsLEZtl5QZRwYdjmNDM1NtDLlBrrd4aEVJQ3HR1HwSBgTr42NjlniCUTJuRhiIId5iSBqRARCdEdi6AICfiMHh0FINqTORhubzODgNgArATUOAYCC5AAaMU09PyESlMrluQAmsqNN4TFicTcDAKcXxUZiSW5lhaysYmEblibxgzsLLqtBDL4AL5sPjqBDIEAAUQAtHQkBgcGQ2ABxCNGKMxrBsNIRgAsydjIAAQpns6mQABJCO2QtsPAR/KFn0+oA=",
  
  // "Bounce" (failed attempt to do Ex 6 in SYNTHI A Manual)
  99: "N4IgJglghgNgziAXKAZhGAXApgJwGI5YCOArlgHYDGAnkgIwAcADADQhqa4BKWcADgHtycLPWZsO2HABksANywwxrEDgjkA5gFkBYWQqWJGKgXEp0CxJACYGAFjanzAZQAWUPqKPiQTus/V9RXoATjpHMzouKABbPiDDAGYVCjkAQQwMKEoAayQANhTyOQB5ciQQorkAESxKKFpEQrZUkpQUAqqAFRwPLAAvAQg9eWDvKoCNclgE5QjKa0siejp8+es3PrnfMw3SKEJZoxCAVnWe6E0YLCPktkIFHAAjLQgAD3oAdhUH3Cej4zzRJLAprHaURKbTxIRJ3cGQ/aHUaGRiJIEXKBXG7ImEqSiuOjqPgkDAAnz46xEklklTkIYiKFeQEgOkQERHZogfF0AQk4kYPDoKTbCm8jD8wWcHDbABWAmocAwEFyAA1opomT45QqlbkAJrqjSavEE64GEUEviY3FsClW8qIZIm6xmsbM7CK6rQFHMAC+bD46gQyBAAFEALR0JAYHBkNh4cOJaOxrBsACSieTcZAAClwycs6mQABxSNJxAx7NpSN2QtsABCNcLvt9QA"
}


function Component(inputPins, outputPin, synthDef) {
  this.init = function () {
    this.inputPins = inputPins;
    this.connectedPins = {};

    if (synthDef.id === undefined) { synthDef.id = "main"; }

    var enclosingDef = {
      id: "output",
      ugen: "flock.ugen.out",
      sources: synthDef
    };

    if (outputPin !== null) { enclosingDef.bus = buses[outputPin]; }

    this.synth = flock.synth({
      synthDef: enclosingDef
    });

    components.push(this);
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
  console.log(state);
  var parsed = JSON.parse(LZString.decompressFromBase64(state));
  console.log(parsed);

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

function storeToBank() {
  localStorage["bank" + currentBank] = saveState();
}

function loadFromBank() {
  loadState(presetBanks[currentBank] || localStorage["bank" + currentBank]);
}

function clearBank() {
  localStorage.removeItem("bank" + currentBank);
}

