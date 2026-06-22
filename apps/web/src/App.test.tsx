import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { store } from "./store";

afterEach(() => {
  cleanup();
});

function renderApp() {
  return render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

describe("App", () => {
  it("renders the weekly planning workspace", async () => {
    renderApp();

    expect(await screen.findByText(/ST6 Weekly Commitments/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic Alignment/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Manager Review" })).toBeInTheDocument();
  });

  it("adds a new RCDO-linked commit", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(await screen.findByLabelText("Commit"), "Review Outlook Graph integration");
    await user.click(screen.getByRole("button", { name: /Add commit/i }));

    expect(await screen.findAllByText("Review Outlook Graph integration")).toHaveLength(2);
  });
});
