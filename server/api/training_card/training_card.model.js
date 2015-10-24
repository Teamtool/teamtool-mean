'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TrainingCardSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('TrainingCard', TrainingCardSchema);