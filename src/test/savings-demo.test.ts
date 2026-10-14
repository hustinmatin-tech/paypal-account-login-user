import { describe, expect, it } from "vitest";
import { emptySavings, moveDemoSavings, savingsTotal } from "@/lib/savings-demo";

describe("in-memory Savings simulation", () => {
  it("moves demo funds into general savings without creating money", () => {
    const before = emptySavings();
    const result = moveDemoSavings(before, 3071, "balance", "general", 1000);
    expect(result?.balanceCents).toBe(2071);
    expect(result?.savings.generalCents).toBe(1000);
    expect(before.generalCents).toBe(0);
  });
  it("returns a withdrawal to the demo balance", () => {
    const result = moveDemoSavings({ generalCents: 1000, goals: [] }, 2071, "general", "balance", 500);
    expect(result?.balanceCents).toBe(2571);
    expect(result?.savings.generalCents).toBe(500);
  });
  it("allocates to a goal without changing total savings", () => {
    const before = { generalCents: 1000, goals: [{ id: 1, name: "Trip", targetCents: 50000, cents: 0 }] };
    const result = moveDemoSavings(before, 2071, "general", 1, 500);
    expect(result?.savings.goals[0].cents).toBe(500);
    expect(result && savingsTotal(result.savings)).toBe(1000);
  });
  it("rejects overspending, invalid amounts, and nonexistent goals", () => {
    expect(moveDemoSavings(emptySavings(), 3071, "balance", "general", 3072)).toBeNull();
    expect(moveDemoSavings(emptySavings(), 3071, "balance", "general", -1)).toBeNull();
    expect(moveDemoSavings(emptySavings(), 3071, "balance", 99, 100)).toBeNull();
  });
  it("starts at zero on a fresh load", () => {
    moveDemoSavings(emptySavings(), 3071, "balance", "general", 1000);
    expect(savingsTotal(emptySavings())).toBe(0);
  });
});