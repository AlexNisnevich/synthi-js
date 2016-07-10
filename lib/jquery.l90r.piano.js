/* jquery.l90r.piano.js
 * 
 * (c) 2010 by Igor Prochazka
 * http://www.l90r.com/posts/piano-a-flexible-piano-keyboard-plugin-for-jquery
 * Licensed under GNU Public License (GPL) version 3 (http://www.gnu.org/licenses/gpl.html)
 *
 * Please, if you find this software useful publish a link back to the plugin's web page.
 */

(function($){
  $.widget('l90r.piano', {
    options: {
      layout : "piano",
      whiteWidth : 18,
      whiteHeight : 100,
      blackWidth : 9,
      blackHeight: 60,
      start : 9,
      keys : 88,
      blackColor : '#666',
      blackColorSelected : '#4f78c4',
      whiteColor : '#f5f5f5',
      whiteColorSelected : '#91b3f2',
      borderColor : '#000',
      sustain : false
    },
    
    // public widget method
    sustain: function(down) {
      this.sustained = down;
      var piano = this;
      if(!down) {
        $.each(piano._getKeys(), function(idx, val) { piano._releaseKey(val); });
      }
    },

    _sustained: false,
    
    _pressedKeys: new Array(),
        
    // layout format: [[<black ("b") or white ("w")>, black key displacement (0: middle, -1: all left, 1: all right)]]
    _layouts : {
      "piano": [["w", 0], ["b", -0.5], ["w", 0], ["b", 0.5], ["w", 0], ["w", 0], ["b", -0.8], ["w", 0], ["b", 0], ["w", 0], ["b", 0.5], ["w", 0]],
            "simple": [["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0], ["b", 0], ["w", 0]],
            "alternating": [["w",0], ["b",0]],
            "plain": [["w",0]]
    },
    
    _create: function(){      
      this._createKeys();
      this.element.children('.piano-key')
        .mousedown(this._mouseDownCb())
        .mouseup(this._mouseUpCb())
        .mouseout(this._mouseUpCb());
      this.element.bind('pianodown', this._highlight(true))
        .bind('pianoup', this._highlight(false));     
      this.sustained = this.options.sustain;
    },
    
    _createKeys: function() {
      var obj = this.element;
      obj.height(this.options.whiteHeight);
      var layout = this._layouts[this.options.layout];
      var modulo = layout.length;
      var blackWidth = this.options.blackWidth;
      var blackHeight = this.options.blackHeight;
      var pos = obj.offset();
      
      // add key div's
      var whiteCounter = 0;
      for(var i=this.options.start; i<this.options.start+this.options.keys; i++) {
        var key = i % modulo;
        if(layout[key][0] == "w") {
          $('<div/>').addClass('piano-ivory piano-key piano-' + i).appendTo(obj).data('piano-key', i);
          whiteCounter++;
        } else {
          var xshift = layout[key][1];
          $('<div/>').width(blackWidth).height(blackHeight).css('position','absolute')
            .offset( { top:pos.top, left:pos.left + 1 + ((this.options.whiteWidth+1)*whiteCounter) + Math.round((-1+xshift)*blackWidth/2) })
            .addClass('piano-ebony piano-key piano-' + i)
            .appendTo(obj)
            .data('piano-key', i);
        }
      }
      
      // style white keys
      var whiteKeys = obj.children('.piano-ivory').width(this.options.whiteWidth).height(this.options.whiteHeight)
        .css('background-color', this.options.whiteColor).css('float', 'left');
      if(this.options.borderColor) {
        whiteKeys.css('border', '1px solid ' + this.options.borderColor).not(":last").css('border-right', 'none');
      }
      
      // style black keys
      if(this.options.borderColor) {
        obj.children('.piano-ebony').css('background-color', this.options.blackColor).css('border', '1px solid ' + this.options.borderColor);
      }
    },
    
    _addKey: function(key) {
      this._pressedKeys[key] = true;
    },
    
    _removeKey: function(key) {
      delete this._pressedKeys[key];
    },
    
    // get array of pressed keys
    _getKeys: function() {
      var keys = [];
      for( var key in this._pressedKeys ) {
        keys.push(key);
      }
      return keys;
    },
    
    _pressKey: function(key) {
        this._addKey(key);
        this.element.trigger('pianodown', [key, this._getKeys()]);      
    },
    
    _releaseKey: function(key) {
        this._removeKey(key);
        this.element.trigger('pianoup', [key, this._getKeys()]);      
    },
    
    _mouseDownCb: function() {
      var piano = this; 
      return function() {
        var key = $(this).data('piano-key');
        piano._pressKey(key);
        return false;
      }
    },
    
    _mouseUpCb: function() {
      var piano = this; 
      return function() {
        if(piano.sustained) {
          return;
        }
        var key = $(this).data('piano-key');
        piano._releaseKey(key);
        return false;
      }
    },
    
    _highlight: function(hi) {
      var piano = this;
      var ivory = hi ? this.options.whiteColorSelected : this.options.whiteColor;
      var ebony = hi ? this.options.blackColorSelected : this.options.blackColor;
      return function(event, key) {
        var test = piano.element.children('.piano-' + key);
        piano.element.children('.piano-ivory.piano-' + key).css('background-color',ivory);
        piano.element.children('.piano-ebony.piano-' + key).css('background-color',ebony);
      }
    }
  });
    
}(jQuery));