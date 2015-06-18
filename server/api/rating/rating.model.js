'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RatingSchema = new Schema({
  content: String,
  star_rating: Number,
  date: { type: Date, default: Date.now },
  author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  active: Boolean
});

RatingSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('idea').populate('author').exec(cb);
  }
};

module.exports = mongoose.model('Rating', RatingSchema);
