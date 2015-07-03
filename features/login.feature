Feature: Login
  As a user of Teamtool
  I should be able to login
  with my valid credentials

  Scenario: Home
    Given I am not logged in
    And I go to the home page
    Then the title should equal "Teamtool"
    Then the menu should contain "Home"
    And the menu should contain "Login"
    And the menu should contain "Sign up"

  Scenario: Charlie logs in
    Given I go on "login"
    When I enter "charlie@user.com" in "user.email"
    And I enter "user" in "user.password"
    And I submit the login form
    Then the menu should contain "Home"
    And the menu should contain "Logout"

  Scenario: Email and password required
    Given I go on "login"
    When I submit the login form
    Then I see the help message "Please enter your email"
    And I see the help message "Please enter your password"

  Scenario: Charlie write the wrong password
    Given I go on "login"
    When I enter "charlie@user.com" in "user.email"
    And I enter "not-valid" in "user.password"
    And I submit the login form
    Then I see the help message "This password is not correct."
