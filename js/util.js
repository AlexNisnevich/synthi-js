function Float32Concat(first, second) {
  var firstLength = first.length,
      result = new Float32Array(firstLength + second.length);

  result.set(first);
  result.set(second, firstLength);

  return result;
}

function Float32Interpolate(first, second, delta) {
  var result = new Float32Array(Math.min(first.length, second.length));
  for (var i=result.length; i-->0;) {
    result[i] = first[i] * delta + second[i] * (1 - delta);
  }
  return result;
}

var tables = {
  // ramp = backwards sawtooth
  ramp: flock.fillTable(64, flock.tableGenerators.saw).map(function (x) {return -x;}),
  
  sin: function (shape) {
    if (shape >= 5) {
      // 10 = full positive rectification
      var rectification = (shape - 5) / 5;
      return flock.fillTable(64, flock.tableGenerators.sin).map(function (x) {
        return x * (1 - rectification) + (Math.abs(x)) * rectification;
      });
    } else {
      // 0 = full negative rectification
      var rectification = (5 - shape) / 5;
      return flock.fillTable(64, flock.tableGenerators.sin).map(function (x) {
        return x * (1 - rectification) + (-Math.abs(x)) * rectification;
      });
    }
  },
  
  square: function (shape) {
    // pulse width modulation (5 = normal square wave)

    if (Math.round(shape) == 5) {
      return flock.fillTable(64, flock.tableGenerators.square);
    }

    var posLength = Math.floor(64 * shape / 10);
    var negLength = 64 - posLength;

    var posValues = flock.fillTable(posLength * 2, flock.tableGenerators.square).filter(function (x) {return x > 0});
    var negValues = flock.fillTable(negLength * 2, flock.tableGenerators.square).filter(function (x) {return x < 0});

    return Float32Concat(posValues, negValues);
  },

  triangle: function (shape) {
    var baseTriangle = flock.fillTable(64, flock.tableGenerators.tri);

    if (shape >= 5) {
      // 10 = only increasing section
      var increasingTriangle = flock.fillTable(128, flock.tableGenerators.tri).slice(64,128);
      return Float32Interpolate(increasingTriangle, baseTriangle, (shape - 5) / 5);
    } else {
      // 0 = only decreasing section
      var decreasingTriangle = flock.fillTable(128, flock.tableGenerators.tri).slice(0,64);
      return Float32Interpolate(decreasingTriangle, baseTriangle, (5 - shape) / 5);
    }
  }
};

(function($){
  $.fn.trackPad = function(props) {
    var options = $.extend({
      width: "300px",
      height: "200px",
      markerDiameter: "50px",
      markerColor: "#DDD"
    }, props || {});

    return this.each(function() {
      var el = $(this);

      el.addClass("trackpad-base").append("<div class='trackpad-marker'></div>").css({
        width: options.width,
        height: options.height
      });

      var marker = $(".trackpad-marker", el);
      var markerRadius = parseInt(options.markerDiameter) / 2;
      
      marker.css({
        width: options.markerDiameter,
        height: options.markerDiameter,
        background: options.markerColor,
        top: parseInt(options.height) / 2 - markerRadius,
        left: parseInt(options.width) / 2 - markerRadius
      });

      var mousedown = false;

      el.on("mousedown", function(event) {
        mousedown = true;

        marker.css({
          top: event.pageY - el.offset().top - markerRadius,
          left: event.pageX - el.offset().left - markerRadius,
        });
      });

      el.on("mousemove", function(event) {
        if (mousedown) {  
          var topOffset = event.pageY - el.offset().top;
          var leftOffset = event.pageX - el.offset().left;

          if (event.pageY - el.offset().top < 0) {
            topOffset = 0;
          } 

          if (event.pageY - el.offset().top > parseInt(options.height)) {
            topOffset = parseInt(options.height);
          }

          if (event.pageX - el.offset().left < 0) {
            leftOffset = 0;
          }

          if (event.pageX - el.offset().left > parseInt(options.width)) {
            leftOffset = parseInt(options.width);
          }

          marker.css({
            top: topOffset - markerRadius,
            left: leftOffset - markerRadius,
          });
        }
      });

      $(document).on("mouseup", function(event) {
        mousedown = false;

        marker.css({
          top: parseInt(options.height) / 2 - markerRadius,
          left: parseInt(options.width) / 2 - markerRadius
        });
      });
    });
  }
})(jQuery);

// Other peoples' util libraries:

// https://github.com/pieroxy/lz-string/
var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

// http://stackoverflow.com/a/22641488
$.fn.scale = function(x) {
    if(!$(this).filter(':visible').length && x!=1)return $(this);
    if(!$(this).parent().hasClass('scaleContainer')){
        $(this).wrap($('<div class="scaleContainer">').css('position','relative'));
        $(this).data({
            'originalWidth':$(this).width(),
            'originalHeight':$(this).height()});
    }
    $(this).css({
        'transform': 'scale('+x+')',
        '-ms-transform': 'scale('+x+')',
        '-moz-transform': 'scale('+x+')',
        '-webkit-transform': 'scale('+x+')',
        'transform-origin': 'right bottom',
        '-ms-transform-origin': 'right bottom',
        '-moz-transform-origin': 'right bottom',
        '-webkit-transform-origin': 'right bottom',
        'position': 'absolute',
        'bottom': '0',
        'right': '0',
    });
    if(x==1)
        $(this).unwrap().css('position','static');else
            $(this).parent()
                .width($(this).data('originalWidth')*x)
                .height($(this).data('originalHeight')*x);
    return $(this);
};