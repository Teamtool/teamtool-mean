Feature: Ideas
  As a user of Teamtool
  I should be able to add new ideas
  and see them in the ideas Backlog list on the same page

  #TEAM-194: As user I want to see the Mean value of all stars
  #TEAM-202: Detailed Statistics for the idea votes
  Scenario: Resl add a new idea
    Given I am logged in as "resa" as user
    And I go to the ideas backlog
    When I enter "I want a green torte" as idea's title
    And I enter "On my wedding I want a green torte because green is my favorite colour" as idea's description
    And I click on the button "Create Idea"
    Then the ideas backlog should contain the idea "I want a green torte" with the description  "On my wedding I want a green torte because green is my favorite colour"

  Scenario: markdich rates Resl's idea
    Given I am logged in as "markdich" as user
    And I go to the ideas backlog
    When I rate the idea "I want a green torte" with 1 stars
    Then I see the mean value of 1 stars for the idea "I want a green torte"


  Scenario: klausimausi rates Resl's idea
    Given I am logged in as "klausimausi" as user
    And I go to the ideas backlog
    When I rate the idea "I want a green torte" with 3 stars
    Then I see the mean value of 2 stars for the idea "I want a green torte"

  Scenario: paleo rates Resl's idea
    Given I am logged in as "paleo" as admin
    And I go to the ideas backlog
    When I rate the idea "I want a green torte" with 5 stars
    Then I see the mean value of 3 stars for the idea "I want a green torte"



