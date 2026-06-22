Feature: Weekly strategic planning
  Managers and individual contributors need weekly commitments tied to RCDO outcomes.

  Scenario: Individual contributor creates and locks a weekly plan
    Given Ava opens the ST6 weekly planning workspace
    When she adds a commit linked to a Supporting Outcome
    And she assigns a chess layer and planned hours
    Then the commit appears in the weekly plan
    And the strategic alignment metric remains at 100 percent
    When she locks the plan
    Then the lifecycle state changes to Locked

  Scenario: Manager reviews reconciliation
    Given Ava has a locked weekly plan
    When the plan advances to reconciliation
    And Ava enters actual hours and a completion status
    Then the reconciliation panel shows planned vs actual variance
    And the manager dashboard reflects the updated actual hours
