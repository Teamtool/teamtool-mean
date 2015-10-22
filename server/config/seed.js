/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Idea = require('../api/idea/idea.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'Snoopy',
    role: 'admin',
    email: 'snoopy@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    username: 'Woodstock',
    role: 'admin',
    email: 'woodstock@admin.com',
    password: 'admin'
  }, {
    provider: 'local',
    username: 'Charlie',
    email: 'charlie@user.com',
    password: 'user'
  }, {
    provider: 'local',
    username: 'Linus',
    email: 'linus@user.com',
    password: 'user'
  }, {
    provider: 'local',
    username: 'Lucy',
    email: 'lucy@user.com',
    password: 'user'
  } , {
    provider: 'local',
    username: 'user',
    email: 'akcasoy@gmail.com',
    password: 'user'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Idea.find({}).remove(function() {
  Idea.create({
    name : 'Development Tools',
    description : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
    author: User.findOne({username: 'Test User'}).username
  }, {
    name : 'Deployment Ready',
    description : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    author: User.findOne({username: 'Test User'}).username
  });

});

