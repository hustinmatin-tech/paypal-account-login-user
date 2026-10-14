import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RewardsFlow } from "@/components/rewards-flow";
import { demoRewardOffers } from "@/lib/rewards-demo";

afterEach(cleanup);
describe("recorded Rewards simulation", () => {
  it.each([
    ["home-depot", 1], ["target", 1], ["aeropostale", 12],
    ["orvis", 5], ["american-eagle", 4], ["safeway", 4],
    ["kroger", 8], ["gas", 2], ["panera", 2],
  ])("uses the recorded percentage for %s", (id, percent) => {
    expect(demoRewardOffers.find(offer => offer.id === id)?.percent).toBe(percent);
  });
  it("saves and removes a sample offer without calling a service", () => {
    render(<RewardsFlow onBack={() => {}}/>);
    fireEvent.click(screen.getByRole("button", { name: "Save Target demo offer" }));
    fireEvent.click(screen.getByRole("tab", { name: "Saved", exact: true }));
    expect(screen.getByRole("button", { name: "Unsave Target demo offer" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Save Home Depot demo offer" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Unsave Target demo offer" }));
    expect(screen.queryByRole("button", { name: "Unsave Target demo offer" })).not.toBeInTheDocument();
  });
  it("does not retain saved demo offers after remounting", () => {
    const first = render(<RewardsFlow onBack={() => {}}/>);
    fireEvent.click(screen.getByRole("button", { name: "Save Target demo offer" }));
    first.unmount();
    render(<RewardsFlow onBack={() => {}}/>);
    expect(screen.getByRole("button", { name: "Save Target demo offer" })).toHaveAttribute("aria-pressed", "false");
  });
  it("returns to the parent card flow", () => {
    const onBack = vi.fn();
    render(<RewardsFlow onBack={onBack}/>);
    fireEvent.click(screen.getByRole("button", { name: "Back to PayPal Debit Card" }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});