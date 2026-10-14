export type CryptoId = "btc" | "eth" | "ltc" | "bch" | "pyusd" | "sol" | "link";
export const cryptoAssets = [
  { id: "btc", name: "Bitcoin", ticker: "BTC", symbol: "₿", price: 104250.32, change: 2.34 },
  { id: "eth", name: "Ethereum", ticker: "ETH", symbol: "♦", price: 2518.46, change: 1.82 },
  { id: "ltc", name: "Litecoin", ticker: "LTC", symbol: "Ł", price: 86.42, change: -0.64 },
  { id: "bch", name: "Bitcoin Cash", ticker: "BCH", symbol: "Ƀ", price: 412.85, change: 1.16 },
  { id: "pyusd", name: "PayPal USD", ticker: "PYUSD", symbol: "$", price: 1, change: 0 },
  { id: "sol", name: "Solana", ticker: "SOL", symbol: "≋", price: 148.73, change: 3.12 },
  { id: "link", name: "Chainlink", ticker: "LINK", symbol: "⬡", price: 13.52, change: -1.08 },
] as const;
export type CryptoAction = "Buy" | "Sell" | "Convert" | "Send" | "Receive";
export type DemoHoldings = Record<CryptoId, number>;
export const emptyHoldings = (): DemoHoldings => ({ btc: 0, eth: 0, ltc: 0, bch: 0, pyusd: 0, sol: 0, link: 0 });
export function demoQuote(id: CryptoId, cents: number) {
  const asset = cryptoAssets.find(item => item.id === id);
  return asset && Number.isSafeInteger(cents) && cents > 0 ? cents / 100 / asset.price : 0;
}
export function applyDemoTrade(holdings: DemoHoldings, id: CryptoId, action: CryptoAction, cents: number, target: CryptoId = "pyusd"): DemoHoldings {
  const units = demoQuote(id, cents);
  if (!units || action === "Receive") return holdings;
  if (action === "Buy") return { ...holdings, [id]: holdings[id] + units };
  if (holdings[id] + 1e-12 < units || (action === "Convert" && id === target)) return holdings;
  return { ...holdings, [id]: Math.max(0, holdings[id] - units), ...(action === "Convert" ? { [target]: holdings[target] + demoQuote(target, cents) } : {}) };
}