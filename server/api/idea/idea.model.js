'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var states = 'Open, Accepted, In Progress, Implemented, Rejected, Deleted'.split(', ');
var categories = 'Ideas Backlog, Training Catalog, User Settings, Login/Logout, Other'.split(', ');

var IdeaSchema = new Schema({
  name: String,
  description: String,
  category: { type: String, enum: categories },
  author: String,
  ratings: [{rater: String, star: Number, date: Date}],
  date: { type: Date, default: Date.now },
  state: { type: String, enum: states }
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

IdeaSchema.virtual('raterCount').get(function() {
  return this.ratings.length;
});

IdeaSchema.virtual('totalStarCount').get(function() {
  return this.ratings.reduce(
    function(total, rating){ return total + rating.star }, 0);
});

IdeaSchema.virtual('averageRating').get(function() {
  return (this.ratings.length != 0) ? (this.totalStarCount / this.ratings.length).toFixed(1) : 0;
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
