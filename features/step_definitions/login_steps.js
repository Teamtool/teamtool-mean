var myStepDefinitionsWrapper = function () {


  this.When(/^I submit the login form$/, function (callback) {
    element(by.css('.btn-login')).click();
    callback();
  });

  this.When(/^I submit the signup form$/, function (callback) {
    element(by.css('.btn-register')).click();
    callback();
  });
};
module.exports = myStepDefinitionsWrapper;
