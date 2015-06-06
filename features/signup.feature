Feature: Login
  As a user of Teamtool
  I should be able to login
  with my valid credentials

  Scenario: Required fields for signup
    Given I go on "signup"
    When I submit the signup form
    Then I see the help message "What's your first name?"
    Then I see the help message "What's your surname?"
    Then I see the help message "Please choose a username"
    Then I see the help message "What's your email address?"
    And I see the help message "Password must be at least 3 characters."
