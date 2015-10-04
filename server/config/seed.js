/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Idea = require('../api/idea/idea.model');
var Rating = require('../api/rating/rating.model');

Thing.find({}).remove(function() {
  Thing.create({
    name : 'Development Tools',
    info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
  }, {
    name : 'Server and Client integration',
    info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  },  {
    name : 'Modular Structure',
    info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
  },  {
    name : 'Optimized Build',
    info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  },{
    name : 'Deployment Ready',
    info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});


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
    email: 'user@user.com',
    password: 'user'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Rating.find({}).remove(function() {
  Rating.create({
      content: 'Test rating',
      star_rating: 3
    }, {
      content: 'Test rating 2',
      star_rating: 4
    }, function() {
      console.log('finished populating rating');
    }
  );
});

Idea.find({}).remove(function() {
  Idea.create({
    name : 'Development Tools',
    description : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.',
    author: User.findOne({username: 'Test User'})._id
  }, {
    name : 'Deployment Ready',
    description : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators',
    author: User.findOne({username: 'Test User'})._id
  });

});

