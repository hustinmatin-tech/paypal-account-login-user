import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { PayPalFlow } from "@/components/paypal-flow";

afterEach(cleanup);

it("retains the completed $15 sample transfer after dismissing its notice and clears it on remount", () => {
  const view = render(<PayPalFlow/>);
  fireEvent.click(screen.getByRole("button", { name: "Finances" }));
  fireEvent.click(screen.getByRole("button", { name: /Transfer From your balance/ }));
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
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  expect(screen.getByText("CAPITAL ONE N.A.")).toBeInTheDocument();
  expect(screen.getByText("−$15")).toBeInTheDocument();
  view.unmount();
  render(<PayPalFlow/>);
  fireEvent.click(screen.getByRole("button", { name: "Finances" }));
  expect(screen.queryByText("CAPITAL ONE N.A.")).not.toBeInTheDocument();
});