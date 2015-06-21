Feature: Ideas
  As a user of Teamtool
  I should be able to add new ideas
  and see them in the ideas Backlog list on the same page

  Scenario: Adding a new idea
    Given I go on "idea"
    When I enter "my title" in "idea.title"
    And I enter "my description" in "idea.description"
    And I click on "Create Idea"
    Then the ideas backlog should contain "my title"
    And the ideas backlog should contain "my description"

