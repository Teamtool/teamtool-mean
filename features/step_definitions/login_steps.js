var myStepDefinitionsWrapper = function () {

  this.When(/^I submit the login form$/, function (callback) {
    element(by.css('.btn-login')).click();
    callback();
  });

  this.When(/^I submit the signup form$/, function (callback) {
    element(by.css('.btn-register')).click();
    callback();
  });

  this.Given(/^I am logged in$/, function (callback) {
    browser.get('http://localhost:9000/login');
    element(by.model('user.email')).sendKeys("test@test.com");
    element(by.model('user.password')).sendKeys("test");
    element(by.css('.btn-login')).click();
    callback();
  });


  this.Given(/^I am logged in as "([^"]*)"$/, function (email, callback) {
    browser.get('http://localhost:9000/login');
    element(by.model('user.email')).sendKeys(email);
    element(by.model('user.password')).sendKeys("test");
    element(by.css('.btn-login')).click();
    callback();
  });

  this.Given(/^I am not logged in$/, function (callback) {
    element(by.css('.logout')).click();
    callback();
  });

  this.Given(/^I go to the home page$/, function (callback) {
    browser.get('http://localhost:9000/');
    callback();
  });
};
module.exports = myStepDefinitionsWrapper;
