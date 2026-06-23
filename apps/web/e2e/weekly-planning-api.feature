Feature: API-backed weekly strategic planning
  The frontend should exercise the Spring API in local demo mode.

  Scenario: Individual contributor creates and locks a weekly plan through the API
    Given Ava opens the API-backed weekly planning workspace
    When she adds an API-backed commit linked to a Supporting Outcome
    Then the API-backed commit appears in the weekly plan
    And the strategic alignment metric remains at 100 percent
    When she locks the API-backed plan
    Then the lifecycle state changes to Locked
