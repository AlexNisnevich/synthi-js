var EnvelopeTrapezoid = new Component(["L"], 11, {
  ugen: "flock.ugen.math",
  inputs: {
    source: {
      id: "env",
      ugen: "flock.ugen.asr",
      start: 0.0,
      attack: 0.01,
      sustain: 1.0,
      on: 1.0,
      release: {
        ugen: "flock.ugen.value",
        value: 1.0,
        mul: {
          ugen: "flock.ugen.math",
          inputs: {
            source: 2,
            pow: {
              id: "input-L1",
              ugen: "flock.ugen.in"
            }
          }
        }
      },
      off: 1.0,
      gate: {
        ugen: "flock.ugen.lfPulse",
        rate: "control",
        freq: {
          ugen: "flock.ugen.math",
          inputs: {
            source: 1,
            div: {
              id: "totalTime1",
              ugen: "flock.ugen.math",
              inputs: {
                source: (0.01 + 1.0 + 1.0),
                add: {
                  id: "decayTime1",
                  ugen: "flock.ugen.value",
                  value: 1.0,
                  mul: {
                    ugen: "flock.ugen.math",
                    inputs: {
                      source: 2,
                      pow: {
                        id: "input-L2",
                        ugen: "flock.ugen.in"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        width: {
          id: "attackTime",
          ugen: "flock.ugen.math",
          inputs: {
            source: (0.01 + 1.0),
            div: {
              id: "totalTime2",
              ugen: "flock.ugen.math",
              inputs: {
                source: (0.01 + 1.0 + 1.0),
                add: {
                  id: "decayTime2",
                  ugen: "flock.ugen.value",
                  value: 1.0,
                  mul: {
                    ugen: "flock.ugen.math",
                    inputs: {
                      source: 2,
                      pow: {
                        id: "input-L3",
                        ugen: "flock.ugen.in"
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
      mul: 7
    },
    add: -4
  }
});
EnvelopeTrapezoid.connect = function (inputPin, connectedPins) {
  this.connectedPins[inputPin] = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});

  this.synth.set("input-L1.bus", inputBuses);
  this.synth.set("input-L2.bus", inputBuses);
  this.synth.set("input-L3.bus", inputBuses);

  this.moveToFront();
};
EnvelopeTrapezoid.set = function (property, value) {
  this.synth.set("env."+property, value);

  var attackTime = this.synth.get("env.attack") + this.synth.get("env.on");
  var decayTime = this.synth.get("env.release.value");
  var totalTime = this.synth.get("env.attack") + this.synth.get("env.on") + this.synth.get("env.off");

  this.synth.set("totalTime1.source", totalTime);
  this.synth.set("totalTime2.source", totalTime);
  this.synth.set("attackTime.source", attackTime);
  this.synth.set("totalTime1.add.value", decayTime);
  this.synth.set("totalTime2.add.value", decayTime);
}

var EnvelopeShaper = new Component(["D", "L"], 12, {
  ugen: "flock.ugen.math", 
  inputs: {
    source: {
      id: "input-D",
      ugen: "flock.ugen.in",
      mul: {
        id: "env",
        ugen: "flock.ugen.asr",
        start: 0.0,
        attack: 0.01,
        sustain: 1.0,
        on: 1.0,
        release: {
          ugen: "flock.ugen.value",
          value: 1.0,
          mul: {
            ugen: "flock.ugen.math",
            inputs: {
              source: 2,
              pow: {
                id: "input-L1",
                ugen: "flock.ugen.in"
              }
            }
          }
        },
        off: 1.0,
        gate: {
          ugen: "flock.ugen.lfPulse",
          rate: "control",
          freq: {
            ugen: "flock.ugen.math",
            inputs: {
              source: 1,
              div: {
                id: "totalTime1",
                ugen: "flock.ugen.math",
                inputs: {
                  source: (0.01 + 1.0 + 1.0),
                  add: {
                    id: "decayTime1",
                    ugen: "flock.ugen.value",
                    value: 1.0,
                    mul: {
                      ugen: "flock.ugen.math",
                      inputs: {
                        source: 2,
                        pow: {
                          id: "input-L2",
                          ugen: "flock.ugen.in"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          width: {
            id: "attackTime",
            ugen: "flock.ugen.math",
            inputs: {
              source: (0.01 + 1.0),
              div: {
                id: "totalTime2",
                ugen: "flock.ugen.math",
                inputs: {
                  source: (0.01 + 1.0 + 1.0),
                  add: {
                    id: "decayTime2",
                    ugen: "flock.ugen.value",
                    value: 1.0,
                    mul: {
                      ugen: "flock.ugen.math",
                      inputs: {
                        source: 2,
                        pow: {
                          id: "input-L3",
                          ugen: "flock.ugen.in"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    mul: 0.5
  }
});
EnvelopeShaper.connect = function (inputPin, connectedPins) {
  this.connectedPins[inputPin] = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});

  if (inputPin == "L") {
    this.synth.set("input-L1.bus", inputBuses);
    this.synth.set("input-L2.bus", inputBuses);
    this.synth.set("input-L3.bus", inputBuses);
  } else {
    this.synth.set("input-"+inputPin+".bus", inputBuses);
  }

  this.moveToFront();
};
EnvelopeShaper.set = function (property, value) {
  this.synth.set("env."+property, value);

  var attackTime = this.synth.get("env.attack") + this.synth.get("env.on");
  var decayTime = this.synth.get("env.release.value");
  var totalTime = this.synth.get("env.attack") + this.synth.get("env.on") + this.synth.get("env.off");

  this.synth.set("totalTime1.source", totalTime);
  this.synth.set("totalTime2.source", totalTime);
  this.synth.set("attackTime.source", attackTime);
  this.synth.set("totalTime1.add.value", decayTime);
  this.synth.set("totalTime2.add.value", decayTime);

  EnvelopeLightOn.synth.set("totalTime1.source", totalTime);
  EnvelopeLightOn.synth.set("totalTime2.source", totalTime);
  EnvelopeLightOn.synth.set("attackTime.source", attackTime);
  EnvelopeLightOn.synth.set("totalTime1.add.value", decayTime);
  EnvelopeLightOn.synth.set("totalTime2.add.value", decayTime);

  EnvelopeLightOff.synth.set("totalTime1.source", totalTime);
  EnvelopeLightOff.synth.set("totalTime2.source", totalTime);
  EnvelopeLightOff.synth.set("attackTime.source", attackTime);
  EnvelopeLightOff.synth.set("totalTime1.add.value", decayTime);
  EnvelopeLightOff.synth.set("totalTime2.add.value", decayTime);
};

var EnvelopeLightOn = new Component(["L"], 0, {
  ugen: "flock.ugen.triggerCallback",
  trigger: {
    id: "trigger",
    ugen: "flock.ugen.lfPulse",
    rate: "control",
    freq: {
      ugen: "flock.ugen.math",
      inputs: {
        source: 1,
        div: {
          id: "totalTime1",
          ugen: "flock.ugen.math",
          inputs: {
            source: (0.01 + 1.0 + 1.0),
            add: {
              ugen: "flock.ugen.value",
              value: 1.0,
              mul: {
                ugen: "flock.ugen.math",
                inputs: {
                  source: 2,
                  pow: {
                    id: "input-L1",
                    ugen: "flock.ugen.in"
                  }
                }
              }
            }
          }
        }
      }
    },
    width: {
      id: "attackTime",
      ugen: "flock.ugen.math",
      inputs: {
        source: (0.01 + 1.0),
        div: {
          id: "totalTime2",
          ugen: "flock.ugen.math",
          inputs: {
            source: (0.01 + 1.0 + 1.0),
            add: {
              ugen: "flock.ugen.value",
              value: 1.0,
              mul: {
                ugen: "flock.ugen.math",
                inputs: {
                  source: 2,
                  pow: {
                    id: "input-L2",
                    ugen: "flock.ugen.in"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  options: {
    callback: {
      func: function () {
        $('#envLight').addClass('on');
      }
    }
  }
});
EnvelopeLightOn.connect = function (inputPin, connectedPins) {
  this.connectedPins[inputPin] = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});
  
  this.synth.set("input-"+inputPin+"1.bus", inputBuses);
  this.synth.set("input-"+inputPin+"2.bus", inputBuses);
  this.moveToFront();
};

var EnvelopeLightOff = new Component(["L"], 0, {
  ugen: "flock.ugen.triggerCallback",
  trigger: {
    ugen: "flock.ugen.math",
    inputs: {
      source: {
        id: "trigger",
        ugen: "flock.ugen.lfPulse",
        rate: "control",
        freq: {
          ugen: "flock.ugen.math",
          inputs: {
            source: 1,
            div: {
              id: "totalTime1",
              ugen: "flock.ugen.math",
              inputs: {
                source: (0.01 + 1.0 + 1.0),
                add: {
                  id: "decayTime1",
                  ugen: "flock.ugen.value",
                  value: 1.0,
                  mul: {
                    ugen: "flock.ugen.math",
                    inputs: {
                      source: 2,
                      pow: {
                        id: "input-L1",
                        ugen: "flock.ugen.in"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        width: {
          id: "attackTime",
          ugen: "flock.ugen.math",
          inputs: {
            source: (0.01 + 1.0),
            div: {
              id: "totalTime2",
              ugen: "flock.ugen.math",
              inputs: {
                source: (0.01 + 1.0 + 1.0),
                add: {
                  id: "decayTime2",
                  ugen: "flock.ugen.value",
                  value: 1.0,
                  mul: {
                    ugen: "flock.ugen.math",
                    inputs: {
                      source: 2,
                      pow: {
                        id: "input-L2",
                        ugen: "flock.ugen.in"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      mul: -1
    }
  },
  options: {
    callback: {
      func: function () {
        $('#envLight').removeClass('on');
      }
    }
  }
});
EnvelopeLightOff.connect = function (inputPin, connectedPins) {
  this.connectedPins[inputPin] = connectedPins;
  var inputBuses = connectedPins.map(function (p) {return buses[p];});
  
  this.synth.set("input-"+inputPin+"1.bus", inputBuses);
  this.synth.set("input-"+inputPin+"2.bus", inputBuses);
  this.moveToFront();
};
