Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  Scenario: Home
    Given I go on "index.html"
    Then the title should equal "Teamtool"
    And the menu should contain "Home"
    And the menu should contain "Login"
    And the menu should contain "Sign up"

  Scenario: Valid Login
    Given I go on "login"
    When I enter "test@test.com" in "user.email"
    And I enter "test" in "user.password"
    And I click on "Login"
    Then the menu should contain "Home"
    And the menu should contain "Hello Test user"
    And the menu should contain "Logout"


