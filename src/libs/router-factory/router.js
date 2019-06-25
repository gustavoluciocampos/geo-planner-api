(function() {
  "use strict";

  var bodyParser = require("body-parser");
  var Controller = require("./controller.js");

  module.exports = Router;

  function Router(defaultRouter, name, controller, fnBefore, fnAfter, auth) {
     var router = defaultRouter;
     
     if(defaultRouter === undefined) {
      router = require("express").Router();
     }

    if (fnBefore && typeof fnBefore === "function") {
      fnBefore(name, controller, router);
    }
    router
      .route("/" + name)
      .get(auth, function(req, res, next) {
        controller.find(req, res, next);
      })
      .put(auth, function(req, res, next) {
        if (req.query.criteria != null) {
          controller.update(req, res, next);
        }else{
          controller.create(req, res, next);
        }
      })
      .delete(auth, function(req, res, next) {
        controller.removeAll(req, res, next);
      })
      .post(auth, function(req, res, next) {
        controller.create(req, res, next);
      });


    router
      .route("/" + name + "/:id")
      .get(auth, function(req, res, next) {
        controller.findById(req, res, next);
      })
      .delete(auth, function(req, res, next) {
        controller.remove(req, res, next);
      })
      .post(auth, function(req, res, next) {
        controller.update(req, res, next);
      })
      .put(auth, function(req, res, next) {
        controller.update(req, res, next);
      });

    if (fnAfter && typeof fnAfter === "function") {
      fnAfter(name, controller, router);
    }

    return router;

  };

}());
