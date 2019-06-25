(function() {
  'use strict';

  var Controller = require('./controller.js');
  var Router = require('./router.js');

  function create(opts) {
    var controller = new Controller(opts.model);
    var router = new Router(opts.router, opts.path, controller, opts.before, opts.after, opts.auth);
    return router;
  }

  exports.Controller = Controller
  exports.Router = Router
  exports.RouterFactory = {
    create: create
  };

}());
