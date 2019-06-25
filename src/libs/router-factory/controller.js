(function() {
  "use strict";

  var errors = require('./errors.js');
  var IllegalArgumentError = errors.IllegalArgumentError;
  var Http404Error = errors.Http404Error;;

  class Controller {

    constructor(model) {

      if (!model) {
        throw new IllegalArgumentError("Provided model can not be undefined")
      }

      this._model = model;
    }

    getModel() {
      return this._model;
    }

    find(req, res, next) {

      var limit = parseInt(req.query.limit, 10) || 25;
      var skip = parseInt(req.query.skip, 10) || 0;
      var criteria = req.query.criteria || req.query.criteria || req.query.selection || "{}";

      if (typeof criteria === "string") {
        try {
          criteria = JSON.parse(criteria);
        } catch (err) {
          return next(err);
        }
      }

      var sort = req.query.sort || req.query.sortBy || req.query.sortby || '{}';

      if (typeof sort === "string") {
        try {
          sort = JSON.parse(sort);
        } catch (err) {
          return next(err);
        }
      }

      var query = this
        .getModel()
        .find(criteria)
        .skip(skip)
        .limit(limit)
        .sort(sort)

      query
        .exec(function(err, result) {
          if (err) {
            return next(err);
          }
          if (!result) {
            return next(new Http404Error());
          } else {
            res.status(200).json(result);
          }

        });

    };

    create(req, res, next) {


      if (!req.body) {
        return next(new IllegalArgumentError("Request body is undefined"));
      }

      this
        .getModel()
        .create(req.body, function(err, resultModel) {
          if (err) {
            err = errors.mapError(err);
            return next(err);
          }
          res.status(200).json(resultModel);
        });

    };

    update(req, res, next) {
      console.log('chegou', req.body)
      var body = req.body;

      if (!body) {
        return next(new IllegalArgumentError("Request body is undefined"));
      }

      var id = req.params.id;

      if (id != null) {

        criteria = {
          _id: id
        }

        this
          .getModel()
          .findByIdAndUpdate(id, body)
          .exec(function(err, result) {
            if (err) {
              err = errors.mapError(err);
              return next(err);
            }
            res.status(200).json(result);
          });

      } else {

        var criteria = req.query.criteria || "{}";

        if (typeof criteria === "string") {
          try {
            criteria = JSON.parse(criteria);
          } catch (err) {
            return next(err);
          }
        }

        this
          .getModel()
          .update(criteria, body, { multi: true })
          .exec(function(err, result) {
            if (err) {
              err = errors.mapError(err);
              return next(err);
            }
            res.status(200).json({
              numberAffected: result
            });
          });

      }

    };

    removeAll(req, res, next) {

      var criteria = req.query.criteria || "{}";

      if (typeof criteria === "string") {
        try {
          criteria = JSON.parse(criteria);
        } catch (err) {
          return next(err);
        }
      }


      this
        .getModel()
        .remove(criteria)
        .exec(function(err, result) {
          if (err) {
            err = errors.mapError(err);
            return next(err);
          }
          res.status(200).json({
            numberAffected: result
          });
        });

    };

    remove(req, res, next) {

      var id = req.params.id;

      this
        .getModel()
        .findByIdAndRemove(id)
        .exec(function(err, removedModel) {

          if (err) {
            err = errors.mapError(err);
            return next(err);
          }

          var ret = {
            deleted: true,
            model: removedModel
          };

          res.status(200).json(ret);

        });

    };

    findById(req, res, next) {

      var id = req.params.id;

      this
        .getModel()
        .findById(id)
        .exec(function(err, result) {

          if (err) {
            err = errors.mapError(err);
            return next(err);
          }

          if (result == null) {
            return next(new Http404Error());
          } else {
            res.status(200).json(result);
          }

        });

    };

  }

  module.exports = Controller;

}());
