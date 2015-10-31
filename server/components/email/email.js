'use strict';

var _ = require('lodash');
var User = require('../../api/user/user.model');
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


function sendEmail(userCriteria, emailContentFile, emailSubject) {
  User.find(userCriteria, {email:1, _id:0}, function(err, users) {
    if (err) throw err;

    var mailTo = "";
    _.each(users, function(user) {
      mailTo += user.email + ",";
    });

    fs.readFile(path.resolve(__dirname, emailContentFile), 'utf8', function (err,content) {
      if (err) return console.log(err);
      send(mailTo, content, emailSubject);
    });
  });
}


function send(mailTo, content, subject) {
  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: 'Teamtool <teamtool.eu@gmail.com>', // sender address
    to: mailTo, // list of receivers
    subject: subject, // Subject line
    html: content // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error) return console.log(error);
    console.log('Message sent: ' + info.response);
  });
}

module.exports = sendEmail;

