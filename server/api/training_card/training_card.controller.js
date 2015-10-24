'use strict';

var _ = require('lodash');
var TrainingCard = require('./training_card.model');

// Get list of training_cards
exports.index = function(req, res) {
  TrainingCard.find(function (err, training_cards) {
    if(err) { return handleError(res, err); }
    return res.json(200, training_cards);
  });
};

// Get a single training_card
exports.show = function(req, res) {
  TrainingCard.findById(req.params.id, function (err, training_card) {
    if(err) { return handleError(res, err); }
    if(!training_card) { return res.send(404); }
    return res.json(training_card);
  });
};

// Creates a new training_card in the DB.
exports.create = function(req, res) {
  TrainingCard.create(req.body, function(err, training_card) {
    if(err) { return handleError(res, err); }
    return res.json(201, training_card);
  });
};

// Updates an existing training_card in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  TrainingCard.findById(req.params.id, function (err, training_card) {
    if (err) { return handleError(res, err); }
    if(!training_card) { return res.send(404); }
    var updated = _.merge(training_card, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, training_card);
    });
  });
};

// Deletes a training_card from the DB.
exports.destroy = function(req, res) {
  TrainingCard.findById(req.params.id, function (err, training_card) {
    if(err) { return handleError(res, err); }
    if(!training_card) { return res.send(404); }
    training_card.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}