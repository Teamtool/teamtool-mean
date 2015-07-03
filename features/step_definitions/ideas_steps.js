//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var Idea = require('../../server/api/idea/idea.model');

var myStepDefinitionsWrapper = function () {

  this.Given(/^I go to the ideas backlog$/, function (callback) {
    browser.get('http://localhost:9000/idea');
    callback();
  });

  this.When(/^I rate the idea "([^"]*)" with (\d+) stars$/, function (arg1, arg2, callback) {
    callback.pending();

  });

  this.Then(/^I see the mean value of (.*) stars for the idea "([^"]*)"$/, function (arg1, arg2, callback) {
    callback.pending();
  });

  this.When(/^I enter "([^"]*)" as idea's title$/, function (input, callback) {
    element(by.model('idea.title')).sendKeys(input);
    callback();
  });

  this.When(/^I enter "([^"]*)" as idea's description$/, function (input, callback) {
    element(by.model('idea.description')).sendKeys(input);
    callback();
  });


  this.Then(/^the ideas backlog should contain the idea "([^"]*)" with the description  "([^"]*)"$/, function (title, arg2, callback) {
    element.all(by.css('.idea-name')).filter(function(elem, index) {
      return elem.getText().then(function(text) {
        return text === title;
      });
    }).then(function(filteredElements) {
      expect(filteredElements).to.have.length.least(1);
      callback();
    });
  });
};
module.exports = myStepDefinitionsWrapper;
