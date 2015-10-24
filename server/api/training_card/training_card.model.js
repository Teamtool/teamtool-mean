'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainingCardSchema = new Schema({
  title: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('TrainingCard', TrainingCardSchema);
