/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Idea = require('./idea.model');

exports.register = function(socket) {
  Idea.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Idea.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  Idea.populate(doc, {path:'author', select: 'username'}, function(err, idea) {
    socket.emit('idea:save', idea);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('idea:remove', doc);
}
