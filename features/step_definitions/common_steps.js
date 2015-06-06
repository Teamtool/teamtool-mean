//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;



var myStepDefinitionsWrapper = function () {
  this.Given(/^I go on "([^"]*)"$/, function (arg1, callback) {
    browser.get('http://localhost:9000/' + arg1);
    callback();
  });


  this.When(/^I enter "([^"]*)" in "([^"]*)"$/, function (input, model, callback) {
    element(by.model(model)).sendKeys(input);
    callback();
  });


  this.Then(/^the title should equal "([^"]*)"$/, function (arg1, callback) {
    expect(browser.getTitle()).to.eventually.equal(arg1).and.notify(callback);
  });

  this.Then(/^the menu should contain "([^"]*)"$/, function (arg1, callback) {
    element.all(by.css('.nav li')).filter(function(elem, index) {
      return elem.getText().then(function(text) {
        return text === arg1;
      });
    }).then(function(filteredElements) {
      expect(filteredElements).to.have.length(1);
      callback();
    });
  });

  this.When(/^I click on "([^"]*)"$/, function (arg1, callback) {
    callback.pending();
  });

  this.Then(/^I see the help message "([^"]*)"$/, function (arg1, callback) {
    element.all(by.css('.help-block')).filter(function(elem, index) {
      return elem.getText().then(function(text) {
        return text === arg1;
      });
    }).then(function(filteredElements) {
      expect(filteredElements).to.have.length(1);
      callback();
    });
  });
};
module.exports = myStepDefinitionsWrapper;
