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


  this.Given(/^I am logged in as "([^"]*)" as user$/, function (name, callback) {
    browser.get('http://localhost:9000/login');
    element(by.model('user.email')).sendKeys(name+"@user.com");
    element(by.model('user.password')).sendKeys("user");
    element(by.css('.btn-login')).click();
    callback();
  });

  this.Given(/^I am logged in as "([^"]*)" as admin$/, function (name, callback) {
    browser.get('http://localhost:9000/login');
    element(by.model('user.email')).sendKeys(name+"@admin.com");
    element(by.model('user.password')).sendKeys("admin");
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
