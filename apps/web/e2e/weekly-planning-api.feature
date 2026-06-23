Feature: API-backed weekly strategic planning
  The frontend should exercise the Spring API in local demo mode.

  Scenario: Individual contributor creates and locks a weekly plan through the API
    Given Ava opens the ST6 weekly planning workspace
    When she adds a commit linked to a Supporting Outcome
    And she assigns a chess layer and planned hours
    Then the commit appears in the weekly plan
    And the strategic alignment metric remains at 100 percent
    When she locks the plan
    Then the lifecycle state changes to Locked
