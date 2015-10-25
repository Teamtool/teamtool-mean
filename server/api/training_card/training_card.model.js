'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainingCardSchema = new Schema({
  title: String,
  abstract: String,
  description: String,
  exercises_apprentice: String,
  exercises_journeyman: String,
  exercises_master: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('TrainingCard', TrainingCardSchema);
