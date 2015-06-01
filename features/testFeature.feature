Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  Scenario: Wrapping WebDriver
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"
    And the menu should contain "Home"
