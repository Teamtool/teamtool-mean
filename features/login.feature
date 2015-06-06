Feature: Login
  As a user of Teamtool
  I should be able to login
  with my valid credentials

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
    And I submit the login form
    Then the menu should contain "Home"
    And the menu should contain "Logout"

  Scenario: Email and password required
    Given I go on "login"
    When I submit the login form
    Then I see the help message "Please enter your email"
    And I see the help message "Please enter your password"

  Scenario: Not valid password
    Given I go on "login"
    When I enter "test@test.com" in "user.email"
    And I enter "not-valid" in "user.password"
    And I submit the login form
    Then I see the help message "This password is not correct."
