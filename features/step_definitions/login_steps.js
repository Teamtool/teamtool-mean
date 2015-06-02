var myStepDefinitionsWrapper = function () {
  this.When(/^I enter "([^"]*)" in "([^"]*)"$/, function (input, model, callback) {
    callback.element(by.model(model)).sendKeys(input);
  });
};
module.exports = myStepDefinitionsWrapper;
