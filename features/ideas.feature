Feature: Ideas
  As a user of Teamtool
  I should be able to add new ideas
  and see them in the ideas Backlog list on the same page

  Scenario: Snoopy add a new idea
    Given I am logged in as "snoopy@admin.com"
    And I go to the ideas backlog
    When I enter "Bigger Food Bowl" into the title input field
    And I enter "I need a bigger food bowl because I earned it" into the description input field
    And I click on the button "Create Idea"
    Then the ideas backlog should contain the idea with the title "Bigger Food Bowl"
    And the ideas backlog should contain the idea with the description  "I need a bigger food bowl because I earned it"

  Scenario: Charlie rates Snoopy's idea
    Given I am logged in as "charlie@user.com"
    And I go to the ideas backlog
    When I rate the idea "Bigger Food Bowl" with 1 stars
    Then I see the mean value of 1 stars for the idea "Bigger Food Bowl"

  Scenario: Linus rates Snoopy's idea
    Given I am logged in as "linus@user.com"
    And I go to the ideas backlog
    When I rate the idea "Bigger Food Bowl" with 3 stars
    Then I see the mean value of 2 stars for the idea "Bigger Food Bowl"

  Scenario: Woodstock rates Snoopy's idea
    Given I am logged in as "woodstock@admin.com"
    And I go to the ideas backlog
    When I rate the idea "Bigger Food Bowl" with 5 stars
    Then I see the mean value of 3 stars for the idea "Bigger Food Bowl"

