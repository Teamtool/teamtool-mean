/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var QuestionAnswer = require('./question_answer.model');

exports.register = function(socket) {
  QuestionAnswer.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  QuestionAnswer.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('question_answer:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('question_answer:remove', doc);
}