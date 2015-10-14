'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var states = 'Open, Accepted, In Progress, Implemented, Rejected, Deleted'.split(', ');
var categories = 'Ideas Backlog, Training Catalog, User Settings, Login/Logout, Other'.split(', ');

var IdeaSchema = new Schema({
  name: String,
  description: String,
  category: { type: String, enum: categories },
  author: {type : Schema.ObjectId, ref : 'User'},
  date: { type: Date, default: Date.now },
  state: { type: String, enum: states },
  totalStarCount: { type: Number, default: 0 },
  raterCount: { type: Number, default: 0 }
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

IdeaSchema.virtual('averageRating').get(function() {
  if(this.raterCount != 0)
    return (this.totalStarCount / this.raterCount).toFixed(1);
  else
    return 0;
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('author').exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
