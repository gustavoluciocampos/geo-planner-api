(function() {
  'use strict';

  var errors = require('errors');

  errors.create({
    name: "IllegalArgumentError",
    code: 400
  })

  errors.create({
    name: "ValidationError",
    code: 400
  })

  errors.create({
    name: "Http404Error",
    code: 404,
    defaultMessage: "Requested resource not found"
  })

  errors
    .mapper('CastError', function(err) {
      return new errors.IllegalArgumentError(err.message);
    })
    .mapper('ValidationError', function(err) {
      var msg = err.message;
      if (err.errors && err.errors.desc && err.errors.desc.message) {
        msg += " - " + err.errors.desc.message;
      }
      return new errors.ValidationError(msg);
    });

  module.exports = errors;
}());
