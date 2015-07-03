//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var Idea = require('../../server/api/idea/idea.model');

var myStepDefinitionsWrapper = function () {
  this.Then(/^the ideas backlog should contain "([^"]*)"$/, function (content, callback) {

    element.all(by.css('.idea-name')).filter(function(elem, index) {
      console.log("###Element: ");
      console.log(elem.getText());
      return elem.getText().then(function(text) {
        return text === content;
      });
    }).then(function(filteredElements) {
      expect(filteredElements).to.have.length(1);
      callback();
    });
  });

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
};
module.exports = myStepDefinitionsWrapper;
