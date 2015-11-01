'use strict';

var _ = require('lodash');
var QuestionAnswer = require('./question_answer.model');

// Get list of question_answers
exports.index = function(req, res) {
  QuestionAnswer.find(function (err, question_answers) {
    if(err) { return handleError(res, err); }
    return res.json(200, question_answers);
  });
};

// Get a single question_answer
exports.show = function(req, res) {
  QuestionAnswer.findById(req.params.id, function (err, question_answer) {
    if(err) { return handleError(res, err); }
    if(!question_answer) { return res.send(404); }
    return res.json(question_answer);
  });
};

// Creates a new question_answer in the DB.
exports.create = function(req, res) {
  QuestionAnswer.create(req.body, function(err, question_answer) {
    if(err) { return handleError(res, err); }
    return res.json(201, question_answer);
  });
};

// Updates an existing question_answer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  QuestionAnswer.findById(req.params.id, function (err, question_answer) {
    if (err) { return handleError(res, err); }
    if(!question_answer) { return res.send(404); }
    var updated = _.merge(question_answer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question_answer);
    });
  });
};

// Deletes a question_answer from the DB.
exports.destroy = function(req, res) {
  QuestionAnswer.findById(req.params.id, function (err, question_answer) {
    if(err) { return handleError(res, err); }
    if(!question_answer) { return res.send(404); }
    question_answer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}