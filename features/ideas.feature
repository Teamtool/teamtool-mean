Feature: Ideas
  As a user of Teamtool
  I should be able to add new ideas
  and see them in the ideas Backlog list on the same page

  Scenario: Adding a new idea
    Given I am logged in as "Klaus"
    And I go to the ideas backlog
    When I enter "Klaus Idea" in "idea.title"
    And I enter "Klaus great idea" in "idea.description"
    And I click on "Create Idea"
    Then the ideas backlog should contain "Klaus Idea"
    And the ideas backlog should contain "Klaus great idea"

  Scenario: First star rating
    Given I am logged in as "Mark"
    And I go to the ideas backlog
    When I rate the idea "Klaus Idea" with 3 stars
    Then I see the mean value of 3 stars for the idea "Klaus Idea"

  Scenario: Second star rating
    Given I am logged in as "Milenko"
    And I go to the ideas backlog
    When I rate the idea "Klaus Idea" with 4 stars
    Then I see the mean value of 3.5 stars for the idea "Klaus Idea"

  Scenario: Third star rating
    Given I am logged in as "Gina"
    And I go to the ideas backlog
    When I rate the idea "Klaus Idea" with 2 stars
    Then I see the mean value of 3 stars for the idea "Klaus Idea"
