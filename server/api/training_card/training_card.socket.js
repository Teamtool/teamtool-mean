/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var TrainingCard = require('./training_card.model');

exports.register = function(socket) {
  TrainingCard.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  TrainingCard.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('training_card:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('training_card:remove', doc);
}