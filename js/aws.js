AWS.config.update({accessKeyId: 'AKIAJT4M43X6TASELXJQ', secretAccessKey: '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'});
AWS.config.region = 'us-west-2';

var bucket = new AWS.S3({params: {Bucket: 'synthi-js-files'}});

function bindUploadControlToInputChannelViaS3(control, channel, opts) {
  control.change(function () {
    var file = control.get()[0].files[0];
    if (file) {
      if (opts.start) { opts.start(); }
      var params = {Key: file.name, ContentType: file.type, Body: file};
      bucket.upload(params, function (err, data) {
        if (err) {
          if (opts.failure) { opts.failure(); }
        } else {
          if (opts.success) { opts.success(); }
          console.log('Uploaded to ' + data.Location);
          channel.set("buffer", {url: data.Location});
        }
      });
    }
  })
}
