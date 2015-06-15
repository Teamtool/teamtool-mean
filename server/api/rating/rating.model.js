'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Rating', RatingSchema);