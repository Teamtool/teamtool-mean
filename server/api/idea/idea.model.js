'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IdeaSchema = new Schema({
  name: String,
  description: String,
  author: {type : Schema.ObjectId, ref : 'User'},
  ratings: [{star_rating: Number, author: {type : Schema.ObjectId, ref : 'User'}}],
  rating: Number,
  date: { type: Date, default: Date.now },
  info: String,
  active: Boolean
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('author').exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
