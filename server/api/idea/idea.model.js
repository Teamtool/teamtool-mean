'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IdeaSchema = new Schema({
  name: String,
  description: String,
  createdBy: {type : Schema.ObjectId, ref : 'User'},
  info: String,
  active: Boolean
});

IdeaSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).populate('user').exec(cb);
  }
};

module.exports = mongoose.model('Idea', IdeaSchema);
