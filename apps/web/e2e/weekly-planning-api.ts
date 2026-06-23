import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

const apiCommitTitle = "Validate API-backed Graph sync";

Given("Ava opens the API-backed weekly planning workspace", () => {
  cy.intercept("GET", "**/api/plans/current*").as("getCurrentPlan");
  cy.visit("/");
  cy.wait("@getCurrentPlan").its("response.statusCode").should("eq", 200);
  cy.findByTestId("workspace-title").should("contain", "Ava Chen");
});

When("she adds an API-backed commit linked to a Supporting Outcome", () => {
  cy.intercept("POST", "**/api/plans/*/commits").as("addCommit");
  cy.findByLabelText("Commit").type(apiCommitTitle);
  cy.findByLabelText("Supporting Outcome").select(
    "Managers complete weekly review within 24 business hours"
  );
  cy.findByLabelText("Chess Layer").select("Knight");
  cy.findByLabelText("Priority").clear().type("4");
  cy.findByLabelText("Planned Hours").clear().type("5");
  cy.findByRole("button", { name: /Add commit/i }).click();
  cy.wait("@addCommit").its("response.statusCode").should("eq", 200);
});

Then("the API-backed commit appears in the weekly plan", () => {
  cy.findByTestId("commit-table").should("contain", apiCommitTitle);
});

Then("the strategic alignment metric remains at 100 percent", () => {
  cy.findByTestId("metric-strategic-alignment").should("contain", "100%");
});

When("she locks the API-backed plan", () => {
  cy.intercept("POST", "**/api/plans/*/lifecycle/advance").as("advanceLifecycle");
  cy.findByRole("button", { name: "Lock plan" }).click();
  cy.wait("@advanceLifecycle").its("response.statusCode").should("eq", 200);
});

Then("the lifecycle state changes to Locked", () => {
  cy.findByTestId("lifecycle-LOCKED").should("have.attr", "aria-current", "step");
});
