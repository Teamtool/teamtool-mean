var myStepDefinitionsWrapper = function () {


  this.When(/^I submit the login form$/, function (callback) {
    element(by.css('.btn-login')).click();
    callback();
  });
};
module.exports = myStepDefinitionsWrapper;
