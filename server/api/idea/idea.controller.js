'use strict';

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /ideas              ->  index
 * POST    /ideas              ->  create
 * GET     /ideas/:id          ->  show
 * PUT     /ideas/:id          ->  update
 * DELETE  /ideas/:id          ->  destroy
 */


var _ = require('lodash');
var Idea = require('./idea.model');
var User = require('../user/user.model');
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'teamtool.eu@gmail.com',
    pass: 'team1234tool'
  }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// Get list of ideas
exports.index = function(req, res) {
  Idea.find(function (err, ideas) {
    if(err) { return handleError(res, err); }
    return res.json(200, ideas);
  });
};

// Get a single idea
exports.show = function(req, res) {
  Idea.findById(req.params.id, function (err, idea) {
    if(err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    return res.json(idea);
  });
};


// Creates a new idea in the DB.
exports.create = function(req, res) {
  Idea.create(req.body, function(err, idea) {
    if(err) { return handleError(res, err); }

    User.find({}, function(err, users) {
      if (err) throw err;

      var mailTo = "";
      for (var i in users) {
        if(idea.author != users[i].username) {
          mailTo = mailTo.concat(users[i].email + ",");
        }
      }

      fs.readFile(path.resolve(__dirname, 'newIdeaMail.html'), 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        sendEmail(mailTo, data);
      });
    });
    return res.json(201, idea);
  });
};

function sendEmail(mailTo, content) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Teamtool <teamtool.eu@gmail.com>', // sender address
    to: mailTo, // list of receivers
    subject: 'There is a new idea!', // Subject line
    html: content // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

// Updates an existing idea in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Idea.findById(req.params.id, function (err, idea) {
    if (err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    var updated = _.merge(idea, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, idea);
    });
  });
};

exports.addRating = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Idea.findById(req.params.id, function (err, idea) {
    if (err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    idea.ratings.push(req.body);
    idea.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, idea);
    });
  });
};

// Deletes a idea from the DB.
exports.destroy = function(req, res) {
  Idea.findById(req.params.id, function (err, idea) {
    if(err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    idea.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
