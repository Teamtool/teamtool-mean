'use strict';

var mongoose = require('mongoose'),
  RatingSchema = require('../rating/rating.model.js'),
  Schema = mongoose.Schema;

var states = 'open accepted in-progress implemented rejected deleted'.split(' ');

var IdeaSchema = new Schema({
  name: String,
  description: String,
  category: String,
  author: {type : Schema.ObjectId, ref : 'User'},
  ratings: [RatingSchema],
  date: { type: Date, default: Date.now },
  state: { type: String, enum: states },
  info: String,
  active: Boolean
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('author').populate('ratings').exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
