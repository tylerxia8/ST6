import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("Ava opens the ST6 weekly planning workspace", () => {
  cy.visit("/");
  cy.findByTestId("workspace-title").should("contain", "Ava Chen");
});

When("she adds a commit linked to a Supporting Outcome", () => {
  cy.findByLabelText("Commit").type("Validate Outlook Graph sync");
  cy.findByLabelText("Supporting Outcome").select(
    "Managers complete weekly review within 24 business hours"
  );
});

When("she assigns a chess layer and planned hours", () => {
  cy.findByLabelText("Chess Layer").select("Knight");
  cy.findByLabelText("Priority").clear().type("4");
  cy.findByLabelText("Planned Hours").clear().type("5");
  cy.findByRole("button", { name: /Add commit/i }).click();
});

Then("the commit appears in the weekly plan", () => {
  cy.findByTestId("commit-table").should("contain", "Validate Outlook Graph sync");
});

Then("the strategic alignment metric remains at 100 percent", () => {
  cy.findByTestId("metric-strategic-alignment").should("contain", "100%");
});

When("she locks the plan", () => {
  cy.findByRole("button", { name: "Lock plan" }).click();
});

Then("the lifecycle state changes to Locked", () => {
  cy.findByTestId("lifecycle-LOCKED").should("have.attr", "aria-current", "step");
});

Given("Ava has a locked weekly plan", () => {
  cy.visit("/");
  cy.findByRole("button", { name: "Lock plan" }).click();
  cy.findByTestId("lifecycle-LOCKED").should("have.attr", "aria-current", "step");
});

When("the plan advances to reconciliation", () => {
  cy.findByRole("button", { name: "Start reconciliation" }).click();
  cy.findByTestId("lifecycle-RECONCILING").should("have.attr", "aria-current", "step");
});

When("Ava enters actual hours and a completion status", () => {
  cy.findByLabelText("Actual hours for Ship RCDO-linked commit form").clear().type("10");
  cy.findByTestId("status-c-1").select("Done");
});

Then("the reconciliation panel shows planned vs actual variance", () => {
  cy.findByTestId("reconciliation-panel").should("contain", "variance -2h");
});

Then("the manager dashboard reflects the updated actual hours", () => {
  cy.findByTestId("manager-dashboard").should("contain", "10 actual");
});
