import { describe, expect, it } from "vitest";
import { applyDemoTrade, cryptoAssets, emptyHoldings } from "@/lib/crypto-demo";

describe("isolated crypto simulation", () => {
  it("buys sample crypto without mutating the previous portfolio", () => {
    const before = emptyHoldings();
    const after = applyDemoTrade(before, "pyusd", "Buy", 1500);
    expect(after.pyusd).toBe(15);
    expect(before.pyusd).toBe(0);
  });
  it("does not sell crypto that is not held", () => {
    const before = emptyHoldings();
    expect(applyDemoTrade(before, "btc", "Sell", 1500)).toBe(before);
  });
  it("converts between sample holdings without creating extra dollar value", () => {
    const before = { ...emptyHoldings(), pyusd: 15 };
    const after = applyDemoTrade(before, "pyusd", "Convert", 1000, "btc");
    expect(after.pyusd).toBe(5);
    expect(after.btc * cryptoAssets[0].price).toBeCloseTo(10, 8);
  });
  it("starts fresh rather than persisting demo holdings", () => {
    applyDemoTrade(emptyHoldings(), "pyusd", "Buy", 1500);
    expect(emptyHoldings().pyusd).toBe(0);
  });
  it("never credits holdings from a receive preview", () => {
    const before = emptyHoldings();
    expect(applyDemoTrade(before, "btc", "Receive", 1500)).toBe(before);
  });
});