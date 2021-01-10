/* Policy document:
  {"expiration": "2020-01-01T00:00:00Z",
    "conditions": [
      {"bucket": "synthi-js-files"},
      ["starts-with", "$key", "uploads/"],
      {"acl": "public-read"},
      ["starts-with", "$Content-Type", ""],
      ["content-length-range", 0, 10485760]
    ]
  }
*/

function bindUploadControlToInputChannelViaS3(control, channel, opts) {
  control.change(function () {
    var file = control.get()[0].files[0];
    if (file) {
      if (opts.start) { opts.start(); }

      var bucket = 'https://synthi-js-files.s3-us-west-2.amazonaws.com/';
      var key = "uploads/" + (new Date).getTime() + '-' + file.name;
      var url = bucket + key;
      console.log('Uploading ' + file.name + ' to ' + url + ' ...');

      var fd = new FormData();
      fd.append('key', key);
      fd.append('acl', 'public-read');
      fd.append('Content-Type', file.type);
      fd.append('AWSAccessKeyId', 'AKIAITBL7TM65BO44EJQ');
      fd.append('policy', 'eyJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAgICJjb25kaXRpb25zIjogWyAKICAgICAgeyJidWNrZXQiOiAic3ludGhpLWpzLWZpbGVzIn0sIAogICAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAidXBsb2Fkcy8iXSwKICAgICAgeyJhY2wiOiAicHVibGljLXJlYWQifSwKICAgICAgWyJzdGFydHMtd2l0aCIsICIkQ29udGVudC1UeXBlIiwgIiJdLAogICAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgMTA0ODU3NjBdCiAgICBdCiAgfQ==');
      fd.append('signature','rqbBBFzy0UXAtVg8Ux2OjzsJNjQ=');

      fd.append("file",file);

      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", function () {
        channel.set("buffer", {url: url});
        if (opts['success']) { opts['success'](); }
      });
      xhr.addEventListener("error", function () { if (opts['failure']) { opts['failure'](); } });
      xhr.addEventListener("abort", function () { if (opts['failure']) { opts['failure'](); } });
      xhr.open('POST', bucket, true);
      xhr.send(fd);
    }
  });
}
