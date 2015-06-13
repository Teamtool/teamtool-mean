'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IdeaSchema = new Schema({
  name: String,
  description: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Idea', IdeaSchema);
