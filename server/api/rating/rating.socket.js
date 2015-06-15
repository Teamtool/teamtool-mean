/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Rating = require('./rating.model');

exports.register = function(socket) {
  Rating.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Rating.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('rating:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('rating:remove', doc);
}