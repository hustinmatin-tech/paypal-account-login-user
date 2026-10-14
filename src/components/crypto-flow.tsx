import { useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowRightLeft, ArrowUpRight, Check, ChevronRight, Delete, Info, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyDemoTrade, cryptoAssets, demoQuote, emptyHoldings, type CryptoAction, type CryptoId } from "@/lib/crypto-demo";

type Step = "overview" | "asset" | "amount" | "review" | "complete" | "receive";
const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD" });
const ranges = ["1H", "1D", "1W", "1M", "1Y", "ALL"];
const lines = ["0,105 12,99 23,109 36,84 49,90 60,69 72,80 85,65 97,78 110,49 123,60 136,44 149,54 163,25 176,37 190,28 204,42 217,19 231,30 246,10 260,19 278,7 300,13", "0,100 16,94 30,97 46,71 62,84 80,70 96,80 110,57 130,67 145,44 162,60 181,31 200,43 222,29 242,35 260,17 280,24 300,12"];

function Coin({ id }: { id: CryptoId }) {
  const asset = cryptoAssets.find(item => item.id === id) ?? cryptoAssets[0];
  return <span className={`pp-coin pp-coin-${id}`} aria-hidden="true">{asset.symbol}</span>;
}

export function CryptoFlow({ onExit, onSavings, renderNavigation }: { onExit: () => void; onSavings: () => void; renderNavigation: () => React.ReactNode }) {
  const [step, setStep] = useState<Step>("overview");
  const [id, setId] = useState<CryptoId>("btc");
  const [action, setAction] = useState<CryptoAction>("Buy");
  const [holdings, setHoldings] = useState(emptyHoldings);
  const [draft, setDraft] = useState("0");
  const [range, setRange] = useState("1D");
  const [transfer, setTransfer] = useState(false);
  const [target, setTarget] = useState<CryptoId>("pyusd");
  const [frequency, setFrequency] = useState("One-time");
  const [activity, setActivity] = useState<{ name: string; cents: number; asset: string }[]>([]);
  const [learn, setLearn] = useState<string | null>(null);
  const asset = cryptoAssets.find(item => item.id === id) ?? cryptoAssets[0];
  const total = cryptoAssets.reduce((sum, item) => sum + holdings[item.id] * item.price, 0);
  const owned = holdings[id] * asset.price;
  const cents = Math.round(Number(draft) * 100);
  const valid = Number.isSafeInteger(cents) && cents >= 100 && (action === "Buy" || cents <= Math.round(owned * 100));
  const begin = (next: CryptoAction) => { setAction(next); setDraft("0"); setTarget(id === "pyusd" ? "btc" : "pyusd"); setTransfer(false); setStep(next === "Receive" ? "receive" : "amount"); };
  const key = (value: string) => setDraft(previous => {
    if (value === "delete") return previous.length > 1 ? previous.slice(0, -1) : "0";
    if (value === ".") return previous.includes(".") ? previous : previous + ".";
    if (previous.length >= 8 || (previous.includes(".") && previous.split(".")[1]?.length === 2)) return previous;
    return previous === "0" ? value : previous + value;
  });
  const finish = () => {
    if (!valid) return;
    setHoldings(previous => applyDemoTrade(previous, id, action, cents, target));
    setActivity(previous => [{ name: action, cents, asset: asset.name }, ...previous]);
    setStep("complete");
  };
  const back = () => { setTransfer(false); setLearn(null); setStep(step === "review" ? "amount" : step === "asset" ? "overview" : "asset"); };

  return <>
    {step === "overview" ? <>
      <div className="pp-scroll pp-crypto-scroll">
        <h1 className="pp-title">Finances</h1>
        <div className="pp-tabs"><Button variant="plain" onClick={onExit}>Balance</Button><Button variant="plain" onClick={onSavings}>Savings</Button><Button variant="plain" className="pp-tab-active" aria-pressed>Crypto</Button></div>
        <section className="pp-crypto-summary"><p>Total crypto</p><h2>{money(total)}</h2><small>Demo portfolio · Illustrative prices</small></section>
        <div className="pp-crypto-actions"><Button variant="plain" onClick={() => { setId("btc"); begin("Buy"); }}><span><Plus/></span>Buy</Button><Button variant="plain" onClick={() => { setId("btc"); begin("Sell"); }}><span><ArrowUpRight/></span>Sell</Button><Button variant="plain" onClick={() => setTransfer(true)}><span><ArrowRightLeft/></span>Transfer</Button></div>
        <section className="pp-crypto-market"><h2>Crypto</h2>{cryptoAssets.map(item => <Button variant="plain" key={item.id} className="pp-crypto-asset-row" onClick={() => { setId(item.id); setRange("1D"); setStep("asset"); }}><Coin id={item.id}/><span><strong>{item.name}</strong><small>{item.ticker}{holdings[item.id] > 0 ? ` · ${holdings[item.id].toFixed(6)}` : ""}</small></span><span><strong>{money(item.price)}</strong><small className={item.change < 0 ? "pp-crypto-down" : "pp-crypto-up"}>{item.change < 0 ? "↓" : "↑"} {Math.abs(item.change).toFixed(2)}%</small></span></Button>)}</section>
        <section className="pp-crypto-discover"><h2>Discover crypto</h2>{["What is crypto?", "Meet PayPal USD"].map(title => <Button variant="plain" key={title} onClick={() => setLearn(title)}><span>{title}</span><ChevronRight/></Button>)}</section>
        <section className="pp-crypto-history"><h2>Crypto activity</h2>{activity.length ? activity.map((item, index) => <div key={index}><span><strong>{item.name} · {item.asset}</strong><small>Demo · Completed</small></span><strong>{money(item.cents / 100)}</strong></div>) : <p>No crypto activity yet</p>}</section>
        <p className="pp-crypto-caption">Crypto can lose value. These sample prices and charts are not live market data.</p>
      </div>{renderNavigation()}
    </> : <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back from crypto" onClick={back}><ArrowLeft/></Button><span>{step === "asset" ? asset.name : step === "receive" ? `Receive ${asset.ticker}` : `${action} ${asset.name}`}</span></header>
      {step === "asset" ? <>
        <div className="pp-scroll pp-crypto-detail"><div className="pp-crypto-asset-heading"><Coin id={id}/><h1>{asset.name} <small>{asset.ticker}</small></h1></div><div className="pp-crypto-price">{money(asset.price)}</div><p className={asset.change < 0 ? "pp-crypto-down" : "pp-crypto-up"}>{asset.change < 0 ? "↓" : "↑"} {Math.abs(asset.change).toFixed(2)}% <span>· Sample {range} change</span></p>
          <svg className="pp-crypto-chart" viewBox="0 0 300 125" role="img" aria-label={`${asset.name} illustrative ${range} price chart`} preserveAspectRatio="none"><polyline points={lines[ranges.indexOf(range) % 2]} fill="none"/></svg>
          <div className="pp-crypto-ranges">{ranges.map(value => <Button variant="plain" key={value} aria-pressed={range === value} className={range === value ? "active" : ""} onClick={() => setRange(value)}>{value}</Button>)}</div>
          <section className="pp-crypto-position"><h2>Your {asset.name}</h2><strong>{money(owned)}</strong><small>{holdings[id].toFixed(8)} {asset.ticker}</small></section>
          <div className="pp-crypto-detail-actions"><Button variant="plain" onClick={() => begin("Sell")}>Sell</Button><Button variant="plain" onClick={() => begin("Convert")}>Convert</Button><Button variant="plain" onClick={() => setTransfer(true)}>Transfer <ArrowRightLeft/></Button></div>
          <section className="pp-crypto-about"><h2>About {asset.name}</h2><p>{id === "pyusd" ? "PayPal USD is a US dollar-denominated stablecoin issued by Paxos. This demo does not hold or issue tokens." : `${asset.name} is a digital asset. Its price can change significantly, and buying crypto involves risk.`}</p><small>Illustrative quote · Not investment advice</small></section>
        </div><div className="pp-complete-footer"><Button variant="paypal" onClick={() => begin("Buy")}>Buy</Button></div>
      </> : step === "amount" ? <>
        <div className="pp-scroll pp-crypto-amount"><Coin id={id}/><h1>{action} {asset.name}</h1><div className="pp-crypto-dollar" aria-live="polite">${draft}</div><p>{action === "Buy" ? "Demo purchase · $1 minimum" : `${money(owned)} available in demo ${asset.ticker}`}</p>
          {action === "Buy" && <label className="pp-crypto-select">Frequency<select value={frequency} onChange={event => setFrequency(event.target.value)}>{["One-time", "Daily", "Weekly", "Biweekly", "Monthly"].map(value => <option key={value}>{value}</option>)}</select></label>}
          {action === "Convert" && <label className="pp-crypto-select">Convert to<select value={target} onChange={event => setTarget(event.target.value as CryptoId)}>{cryptoAssets.filter(item => item.id !== id).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
          {action === "Send" && <div className="pp-crypto-recipient"><small>Sample recipient</small><strong>Demo contact</strong><p>No address collected. No crypto sent.</p></div>}
          {Number(draft) > 0 && !valid && <p role="status">{cents < 100 ? "Enter at least $1." : "Not enough demo crypto. Buy a sample amount first."}</p>}
        </div><div className="pp-continue"><Button variant="paypal" disabled={!valid} onClick={() => setStep("review")}>Next</Button></div><div className="pp-keyboard-area pp-crypto-keypad"><div className="pp-keyboard">{["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"].map(value => <Button variant="keypad" key={value} aria-label={value === "delete" ? "Delete amount digit" : value} onClick={() => key(value)}>{value === "delete" ? <Delete/> : value}</Button>)}</div></div>
      </> : step === "review" ? <>
        <div className="pp-scroll pp-crypto-review"><h1>Review your {action.toLowerCase()}</h1><div className="pp-crypto-review-coin"><Coin id={id}/><strong>{money(cents / 100)}</strong><span>{demoQuote(id, cents).toFixed(8)} {asset.ticker}</span></div><dl><div><dt>{action === "Buy" ? "Payment method" : "From"}</dt><dd>{action === "Buy" ? "Demo balance" : asset.name}</dd></div>{action === "Buy" && <div><dt>Frequency</dt><dd>{frequency}</dd></div>}{action === "Convert" && <div><dt>Convert to</dt><dd>{cryptoAssets.find(item => item.id === target)?.name}</dd></div>}{action === "Send" && <div><dt>To</dt><dd>Demo contact</dd></div>}<div><dt>Sample price</dt><dd>{money(asset.price)}</dd></div><div><dt>Demo fee</dt><dd>$0.00</dd></div><div><dt>Total</dt><dd>{money(cents / 100)}</dd></div></dl><p className="pp-crypto-caption"><Info/> Simulation only. No payment, trade, recurring order, or transfer will be submitted. Fees and prices are illustrative, not a PayPal quote.</p></div><div className="pp-complete-footer"><Button variant="paypal" onClick={finish}>{action} Now · Demo</Button></div>
      </> : step === "complete" ? <>
        <section className="pp-crypto-complete" aria-live="polite"><div className="pp-confirmation-check"><Check/></div><h1>Demo {action.toLowerCase()} complete</h1><p>{money(cents / 100)} · {asset.name}</p><small>No real money or crypto moved.{frequency !== "One-time" && action === "Buy" ? " No recurring order was created." : ""}</small></section><div className="pp-complete-footer"><Button variant="paypal" onClick={() => setStep("overview")}>Done</Button></div>
      </> : <div className="pp-scroll pp-crypto-receive"><Coin id={id}/><h1>Receive {asset.name}</h1><div className="pp-crypto-receive-symbol"><ArrowDownLeft/></div><h2>Demo receive preview</h2><p>A real receive screen shows a wallet address and QR code. Neither is generated in this demo.</p><p>Never send real crypto to a demonstration.</p><Button variant="paypal" onClick={() => setStep("asset")}>Done</Button></div>}
    </>}
    {transfer && <><div className="pp-overlay" onClick={() => setTransfer(false)}/><section className="pp-sheet pp-crypto-sheet" role="dialog" aria-modal="true" aria-label="Transfer crypto"><header><h2>Transfer crypto</h2><Button variant="plain" size="icon" aria-label="Close crypto transfer" onClick={() => setTransfer(false)}><X/></Button></header><Button variant="plain" onClick={() => begin("Send")}><ArrowUpRight/><span><strong>Send</strong><small>To a sample contact</small></span><ChevronRight/></Button><Button variant="plain" onClick={() => begin("Receive")}><ArrowDownLeft/><span><strong>Receive</strong><small>Preview receiving crypto</small></span><ChevronRight/></Button></section></>}
    {learn && <><div className="pp-overlay" onClick={() => setLearn(null)}/><section className="pp-sheet pp-crypto-sheet" role="dialog" aria-modal="true" aria-label={learn}><header><h2>{learn}</h2><Button variant="plain" size="icon" aria-label="Close article" onClick={() => setLearn(null)}><X/></Button></header><p>{learn === "Meet PayPal USD" ? "PayPal USD (PYUSD) is a US dollar-denominated stablecoin issued by Paxos. Stablecoins also carry risks." : "Cryptocurrency is a digital asset. Prices can be volatile, and you can lose the amount you invest. Learn about an asset and its risks before making financial decisions."}</p></section></>}
  </>;
}