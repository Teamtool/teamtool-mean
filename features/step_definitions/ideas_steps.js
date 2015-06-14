//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var myStepDefinitionsWrapper = function () {
  this.Then(/^the ideas backlog should contain "([^"]*)"$/, function (content, callback) {
    element.all(by.css('.ng-binding')).filter(function(elem, index) {
      return elem.getText().then(function(text) {
        return text === content;
      });
    }).then(function(filteredElements) {
      expect(filteredElements).to.have.length(1);
      callback();
    });
  });
};
module.exports = myStepDefinitionsWrapper;
