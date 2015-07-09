'use strict';

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /ideas              ->  index
 * POST    /ideas              ->  create
 * GET     /ideas/:id          ->  show
 * PUT     /ideas/:id          ->  update
 * DELETE  /ideas/:id          ->  destroy
 */


var _ = require('lodash');
var Idea = require('./idea.model');

// Get list of ideas
exports.index = function(req, res) {
  Idea.find(function (err, ideas) {
    if(err) { return handleError(res, err); }
    return res.json(200, ideas);
  }).populate('author');
};

// Get a single idea
exports.show = function(req, res) {
  Idea.findById(req.params.id, function (err, idea) {
    if(err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    return res.json(idea);
  });
};

// Creates a new idea in the DB.
exports.create = function(req, res) {
  Idea.create(req.body, function(err, idea) {
    if(err) { return handleError(res, err); }
    return res.json(201, idea);
  });
};

// Updates an existing idea in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Idea.findById(req.params.id, function (err, idea) {
    if (err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    var updated = _.merge(idea, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, idea);
    });
  });
};

// Deletes a idea from the DB.
exports.destroy = function(req, res) {
  Idea.findById(req.params.id, function (err, idea) {
    if(err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    idea.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
