'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var states = 'Open, Answered, Current, Deleted'.split(', ');

var QuestionAnswerSchema = new Schema({
  text: String,
  author: String,
  ratings: [{_id:false, rater: String, star: Number, date: {type: Date, default: Date.now}}],
  date: { type: Date, default: Date.now },
  state: { type: String, enum: states }
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

QuestionAnswerSchema.virtual('raterCount').get(function() {
  return this.ratings.length;
});

QuestionAnswerSchema.virtual('totalStarCount').get(function() {
  return this.ratings.reduce(
    function(total, rating){ return total + rating.star }, 0);
});

QuestionAnswerSchema.virtual('averageRating').get(function() {
  return (this.raterCount != 0) ? (this.totalStarCount / this.raterCount).toFixed(1) : 0;
});

QuestionAnswerSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  }
};

module.exports = mongoose.model('QuestionAnswer', QuestionAnswerSchema);
