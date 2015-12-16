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

$(function () {
  $("#patches input").change(function () {
    connectPin($(this));
  });
});
