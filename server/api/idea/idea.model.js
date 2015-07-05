'use strict';

var mongoose = require('mongoose'),
  RatingSchema = require('../rating/rating.model.js'),
  Schema = mongoose.Schema;


var IdeaSchema = new Schema({
  name: String,
  description: String,
  author: {type : Schema.ObjectId, ref : 'User'},
  ratings: [RatingSchema],
  rating: Number,
  date: { type: Date, default: Date.now },
  info: String,
  active: Boolean
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('author').populate('ratings').exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
