Feature: Signup
  As a user of Teamtool
  I should be able to signup
  by means of the registration form

  Scenario: Required fields for signup
    Given I go on "signup"
    When I submit the signup form
    Then I see the help message "What's your first name?"
    Then I see the help message "What's your surname?"
    Then I see the help message "Please choose a username"
    Then I see the help message "What's your email address?"
    And I see the help message "Password must be at least 3 characters."

  Scenario: Valid Signup
    Given I go on "signup"
    When I enter "my first name" in "user.firstname"
    And I enter "my surname" in "user.surname"
    And I enter "my username" in "user.username"
    And I enter "my_email@test.com" in "user.email"
    And I enter "my_email@test.com" in "user.confirmEmail"
    And I enter "my psw" in "user.password"
    And I enter "my psw" in "user.confirmPassword"
    When I submit the signup form
    Then the menu should contain "Home"
    And the menu should contain "Logout"
