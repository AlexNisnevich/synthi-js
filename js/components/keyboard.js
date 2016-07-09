var keyboardSettings = {
  output1: 'signal',
  output2: 'control',
  spread: 12,
  baseFreq: 440,
  level: 1
}

var KeyboardVco1 = new Component([], 8, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: 440,
  options: {
    interpolation: "linear"
  },
  mul: 0,
  add: 0
});

var KeyboardVco2 = new Component([], 9, {
  ugen: "flock.ugen.osc",
  table: tables.ramp,
  freq: 440,
  options: {
    interpolation: "linear"
  },
  mul: 0,
  add: 0
});

// a = 60, w = 61, etc.
var keyArray = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';', "'"];

var lastNote = null, prevNote = null;
var keyStatus = {};
function getPressedKeys() { return Object.keys(keyStatus).filter(function (k) {return keyStatus[k];}); }

function updateKeyboardNotes(notes) {
  var output1 = keyboardSettings.output1;
  var output2 = keyboardSettings.output2;
  var spread = keyboardSettings.spread;
  var baseFreq = keyboardSettings.baseFreq;
  var level = keyboardSettings.level;

  if (notes.length == 0) {
    // No keys pressed
    KeyboardVco1.set('mul', 0);
    KeyboardVco1.set('add', 0);
    KeyboardVco2.set('mul', 0);
    KeyboardVco2.set('add', 0);

  } else {
    if (output1 == 'signal' && output2 == 'signal') {
      // Duophonic operation mode (two signal outputs)
      if (notes.length == 1) {
        KeyboardVco1.set('freq', noteToFreq(notes[0], spread, baseFreq));
        KeyboardVco1.set('mul', level);
        KeyboardVco2.set('mul', 0);
      } else {
        KeyboardVco1.set('freq', noteToFreq(notes[0], spread, baseFreq));
        KeyboardVco2.set('freq', noteToFreq(notes[1], spread, baseFreq));
        KeyboardVco1.set('mul', level);
        KeyboardVco2.set('mul', level);
      }

    } else if (output1 == 'control' && output2 == 'control') {
      // Duophonic operation mode (two control outputs)
      KeyboardVco1.set('mul', 0);
      KeyboardVco2.set('mul', 0);
      if (notes.length == 1) {
        KeyboardVco1.set('add', (notes[0] - 69) / 12);
        KeyboardVco2.set('add', 0);
      } else {
        KeyboardVco1.set('add', (notes[0] - 69) / 12);
        KeyboardVco2.set('add', (notes[1] - 69) / 12);
      }

    } else {
      // Monophonic operation mode (one signal output and one control output)
      if (output1 == 'signal') {
        KeyboardVco1.set('freq', noteToFreq(notes[0], spread, baseFreq)); // e.g. 69 (A4) -> 440, 81 (A5) -> 880
        KeyboardVco1.set('mul', level);
      } else {
        KeyboardVco1.set('add', (lastNote - 69) / 12); // e.g. 69 (A4) -> 0, 81 (A5) -> 1
        KeyboardVco1.set('mul', 0);
      }

      if (output2 == 'signal') {
        KeyboardVco2.set('freq', noteToFreq(notes[0], spread, baseFreq));
        KeyboardVco2.set('mul', level);
      } else {
        KeyboardVco2.set('add', (lastNote - 69) / 12);
        KeyboardVco2.set('mul', 0);
      }
    } 
  } 
}

function keyboardHandleKeyPress(e) {
  // Keyboard is in duophonic mode iff both outputs are set to the same mode.
  var keyboardMode = (keyboardSettings.output1 == keyboardSettings.output2) ? 'duo' : 'mono';

  var key = String.fromCharCode(event.which).toLowerCase();
  var newNote = 60 + keyArray.indexOf(key);
  if (newNote != lastNote) {
    keyStatus[newNote] = true;
    prevNote = (keyboardMode == 'duo') ? lastNote : null;
    lastNote = newNote;

    if (keyArray.indexOf(key) > -1) {
      var pressedKeys = getPressedKeys();

      // Kind of nasty bit of work here to limit maximum # keys allowed.
      var maxNumKeys = {'mono': 1, 'duo': 2}[keyboardMode];
      if (pressedKeys.length > maxNumKeys) {
        pressedKeys.filter(function (k) { return (k != prevNote) && (k != lastNote); })
          .forEach(function (note) {
            $('.piano-' + note).trigger('pianoup', [note, pressedKeys]);
        });
        pressedKeys = pressedKeys.filter(function (k) { return (k == prevNote) || (k == lastNote); })
      }

      $('.piano-' + newNote).trigger('pianodown', [newNote, pressedKeys]);
    }
  }
}

function keyboardHandleKeyRelease(e) {
  var key = String.fromCharCode(event.which).toLowerCase();
  var note = 60 + keyArray.indexOf(key);
  if (note == lastNote) { lastNote = null; }
  keyStatus[note] = false;
  $('.piano-' + note).trigger('pianoup', [note, getPressedKeys()]);
}
