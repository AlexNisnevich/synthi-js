# SYNTHI-JS
SYNTHI-JS is an emulator of the legendary [EMS Synthi A](https://en.wikipedia.org/wiki/EMS_Synthi_A) modular synthesizer, built in JavaScript on top of the [Flocking](http://flockingjs.org/) library.

**[>>> TRY IT ONLINE <<<](https://alexnisnevich.github.io/synthi-js/)**

![Screenshot of SYNTHI-JS](http://i.imgur.com/Cp7Iuwb.jpg)

## Features

* Devices
   * 3 oscillators
   * noise generator
   * low-pass filter
   * ring modulator
   * analog-style reverberator
   * self-triggering envelope generator
* 16x16 control patchboard
* Bidirectional trackpad ("joystick") controller
* Scope module displaying "voltage" over time
* 100 patch memory banks with import/export functionality and _(new in v1.1!)_ 5 built-in presets
* _(new in v1.2!)_ File upload functionality for input sources via S3
* _(new in v1.2!)_ Customizable knob behavior

## Getting Started

First, open up [SYNTHI-JS](https://alexnisnevich.github.io/synthi-js/) and take a look around.

SYNTHI-JS can look daunting at first, but creating patches with it is actually quite straightforward. The patchboard functions as a _routing_ mechanism: device outputs on the left side of the patchboard get routed to device inputs on the top side of the patchboard.

Let's make our first patch! Click on the button at A1 at the patchboard to connect the sine-wave output of Oscillator 1 to Output Channel 1. You should hear a 440 Hz sine wave coming out of your left speaker – congratulations!

We can now try messing around with it a little. Try plugging the oscillator first into another component - perhaps the filter or the reverb module, and then try plugging _that_ into an output channel (for example, G1 and A14). Try turning some knobs to alter the sound. Or perhaps try mixing two oscillator together into the ring modulator and outputting the result (E1, F3, A13). Try turning some knobs and see how it affects the output.

In addition to hooking up your final output to the Output Channels (columns A and C), you can also hook it up to the Scope (column B) to be able to observe the waveform. The scope is a great tool for debugging issues in your patch.

Now that you have a sense of how the patchboard works, try loading some presets to get a feel for what this thing can do. The presets are currently stored in memory banks `00`-`04` (and indicated with a `P`). Note that preset `02` only produces sound when you touch the joystick control.

Another neat way to get started is to upload your own audio tracks to use as input sources. Use the Input Sources panel to upload tracks and (optionally) specify which segments of them you want to work with. Now, you can use the Input Channel pins on the patchboard (rows 8 and 9) as an input source. Try running your tracks through different devices and see what happens.

To learn more, read the SYNTHI-JS manual by clicking the **?** button near the patchboard. 

## Development

SYNTHI-JS is completely client-side and requires no build process. Simply clone the repo, open `index.html` in your browser (Chrome 45+ recommended), and get started!

I do admit that importing dozens of separate JavaScript files is not the best use of resources. Sometime soon I'd like make a simple build script to concatenate and minify them to speed up load times. 

### To-Do / Wish List

My goal is to make as faithful a reproduction of the Synthi A as possible, but there have been features of it that I have been unable to reproduce, whether because of conceptual difficulties or just lack of time. Here are the ones that I know of at the moment:

* The ability to have circular chains of component dependencies (for example, A depends on B and B depends on A). As far as I can tell, this is not possible in Flocking, but I'm open to suggestions.
* An emulation of the [EMS DK](http://www.rlmusic.co.uk/rlm3/wp-content/uploads/2014/09/EMS_DK2_914_01.jpg) keyboard.
* An emulation of the [EMS KS](http://www.phutney.com/EMSAKS/WebKSDetail.JPG) sequencer.
* In general, many of the components of SYNTHI-JS don't follow the specs as well as they could. As I don't personally have a Synthi A to test, I've been doing the best I could from videos and spec sheets. All feedback is much appreciated.

It would also be great to fix or reduce the audio buzz that happens while turning knobs or otherwise controlling the UI, but I haven't been able to do anything about it. Perhaps it's a browser limitation?

## Acknowledgements

SYNTHI-JS was created by [Alex Nisnevich](https://alexnisnevich.github.io/synthi-js/).

I'd like to thank:
* [Colin Clark](https://github.com/colinbdclark), without whose [Flocking](http://flockingjs.org/) library this wouldn't be possible.
* the [Vintage Synth Museum](http://www.vintagesynthmuseum.com/VSM_Home.html) in Oakland, for showing me my first Synthi A, and Sasha for taking me there.
* My beta testers: Jacob, Greg, Matt, Kyan, Joseph, Tyler, Dmitry, Michael, did I miss anyone?
