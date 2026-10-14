import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PayPalFlow } from "@/components/paypal-flow";

afterEach(cleanup);

function completeTransfer() {
  fireEvent.click(screen.getByRole("button", { name: "Finances" }));
  fireEvent.click(screen.getByRole("button", { name: "Transfer From your balance" }));
  fireEvent.click(screen.getByRole("button", { name: "Transfer to bank" }));
  fireEvent.click(screen.getByRole("button", { name: "Edit transfer amount" }));
  for (let i = 0; i < 5; i++) fireEvent.click(screen.getByRole("button", { name: "Delete transfer digit" }));
  fireEvent.click(screen.getByRole("button", { name: "1" }));
  fireEvent.click(screen.getByRole("button", { name: "5" }));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  fireEvent.click(screen.getByRole("button", { name: "Change" }));
  fireEvent.click(screen.getByRole("button", { name: /CAPITAL ONE N.A./ }));
  fireEvent.click(screen.getByRole("button", { name: "Transfer $15.00 USD Now" }));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Done" }));
}

describe("recorded transfer continuation", () => {
  it("keeps the completed $15 Capital One demo transfer after notice dismissal and card return", () => {
    render(<PayPalFlow/>);
    completeTransfer();
    expect(screen.getByText("−$15")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Get a PayPal Debit Card" }));
    fireEvent.click(screen.getByRole("button", { name: "Close debit card offer" }));
    expect(screen.getByText("CAPITAL ONE N.A.")).toBeInTheDocument();
    expect(screen.getByText("−$15")).toBeInTheDocument();
  });

  it("clears completed demo transfers on a fresh mount", () => {
    const first = render(<PayPalFlow/>);
    completeTransfer();
    expect(screen.getByText("−$15")).toBeInTheDocument();
    first.unmount();
    render(<PayPalFlow/>);
    fireEvent.click(screen.getByRole("button", { name: "Finances" }));
    expect(screen.queryByText("−$15")).not.toBeInTheDocument();
    expect(screen.queryByText("CAPITAL ONE N.A.")).not.toBeInTheDocument();
  });
});