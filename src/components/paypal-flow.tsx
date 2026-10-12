import { useEffect, useState } from "react";
import { ArrowLeft, Banknote, ChartNoAxesColumnIncreasing, House, Wallet, Gift, Trophy, ScanLine, X, Plus, Delete, Camera, Landmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundingArt } from "@/components/funding-art";

type Screen = "home" | "finances" | "amount" | "methods" | "link";

function PayPalMark({ colorful = false }: { colorful?: boolean }) {
  return <svg className={colorful ? "paypal-mark colorful" : "paypal-mark"} viewBox="0 0 80 90" aria-label="PayPal" role="img"><path className="p-back" d="M19 8h30c25 0 30 13 25 30-4 16-17 23-36 23h-9l-4 22H8z"/><path className="p-front" d="M31 27h25c19 0 25 10 21 24-4 14-15 21-31 21h-8l-4 18H20z"/><path className="p-overlap" d="M31 27h25c8 0 14 2 18 5-3 20-16 29-36 29h-13z"/></svg>;
}

function BankLogo() { return <span className="pp-bank-logo" aria-hidden="true">BANK</span>; }

const navigation = [{ label: "Home", icon: House }, { label: "Finances", icon: ChartNoAxesColumnIncreasing }, { label: "Payments", icon: Banknote }, { label: "Deals", icon: Gift }, { label: "Wallet", icon: Wallet }];

export function PayPalFlow() {
  const [screen, setScreen] = useState<Screen>("home");
  const [amount, setAmount] = useState("0");
  const [sheet, setSheet] = useState(false);
  const [method, setMethod] = useState("debit");
  const [loading, setLoading] = useState(false);
  const [cryptoBanner, setCryptoBanner] = useState(true);
  const [card, setCard] = useState("");
  const openLink = () => { setSheet(false); setCard(""); setScreen("link"); };
  const cardKey = (key: string) => setCard(p => key === "delete" ? p.slice(0, -1) : p.length >= 16 ? p : p + key);

  const openAmount = () => { setAmount("0"); setScreen("amount"); };
  const chooseAmount = (value: string) => {
    setAmount(value); setLoading(true);
    window.setTimeout(() => { setLoading(false); setScreen("methods"); setMethod("debit"); setSheet(true); }, 450);
  };
  const enterKey = (key: string) => setAmount(previous => {
    if (key === "delete") return previous.length > 1 ? previous.slice(0, -1) : "0";
    if (key === ".") return previous.includes(".") ? previous : previous + ".";
    if (previous.length >= 8 || (previous.includes(".") && previous.split(".")[1]?.length === 2)) return previous;
    return previous === "0" ? key : previous + key;
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (screen === "link") { if (/^[0-9]$/.test(event.key)) cardKey(event.key); if (event.key === "Backspace") cardKey("delete"); return; }
      if (screen !== "amount" || loading) return;
      if (/^[0-9.]$/.test(event.key)) enterKey(event.key);
      if (event.key === "Backspace") enterKey("delete");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, loading]);

  return <main className="pp-stage"><div className="pp-app">
    {screen === "link" ? <>
      <header className="pp-link-header"><Button variant="plain" size="icon" aria-label="Close" onClick={() => { setScreen("methods"); setSheet(true); }}><X/></Button><div><span>Link a debit card</span><small>Visa or Mastercard only</small></div></header>
      <div className="pp-link-content"><div className="pp-card-art" aria-hidden="true"><i/><i/><b/></div><p>Let’s start with your number.</p><div className="pp-card-input">{card ? (card.match(/\d{1,4}/g) ?? []).join(" ") : null}<span className="pp-caret"/>{!card && <span className="pp-card-placeholder">Debit card number</span>}</div><Button variant="plain" className="pp-scan"><Camera/>Scan your card</Button></div>
      <div className="pp-keyboard-area"><div className="pp-keyboard">{[{n:"1",l:""},{n:"2",l:"ABC"},{n:"3",l:"DEF"},{n:"4",l:"GHI"},{n:"5",l:"JKL"},{n:"6",l:"MNO"},{n:"7",l:"PQRS"},{n:"8",l:"TUV"},{n:"9",l:"WXYZ"},{n:"",l:""},{n:"0",l:""},{n:"delete",l:""}].map(({n,l},i) => n === "" ? <span key={i}/> : <Button key={n} variant="keypad" className={n === "delete" ? "pp-key-transparent" : ""} aria-label={n === "delete" ? "Delete digit" : n} onClick={() => cardKey(n)}>{n === "delete" ? <Delete/> : <><span>{n}</span>{l && <small>{l}</small>}</>}</Button>)}</div></div>
    </> : (screen === "home" || screen === "finances") ? <>
      <div className="pp-scroll">
        {screen === "home" ? <>
          <header className="pp-home-header"><div className="pp-avatar"> </div><div><Button variant="plain" size="icon" aria-label="Rewards"><Trophy/></Button><Button variant="plain" size="icon" aria-label="Scan"><ScanLine/></Button></div></header>
          <div className="pp-accounts"><div className="pp-account" onClick={() => setScreen("finances")}><PayPalMark/><p>PayPal balance</p><strong>$30.71</strong><Button variant="plain" onClick={event => { event.stopPropagation(); openAmount(); }}>Add money</Button></div><div className="pp-account"><Banknote className="pp-savings-icon"/><p>PayPal Savings</p><strong>$0.00</strong><div className="pp-apy">↑ APY: <span>4.00%</span></div></div></div>
          <div className="pp-setup"><div className="pp-progress">4/5</div><div><strong>Set up your account</strong><p>You're almost done!</p></div></div>
          {cryptoBanner && <div className="pp-crypto"><span className="pp-crypto-art">💸</span><div><strong>Move crypto your way—<br/>Send. Receive. Enjoy.</strong><p>Terms apply.</p></div><Button variant="plain" size="icon" aria-label="Dismiss crypto banner" onClick={() => setCryptoBanner(false)}><X/></Button></div>}
          <section className="pp-activity"><h2>Recent activity</h2><div className="pp-transaction"><div className="pp-bank"><Landmark/></div><div><strong>SUTTON BANK</strong><p>Feb 14</p><p>Transfer to bank · Completed</p></div></div></section>
        </> : <>
          <h1 className="pp-title">Finances</h1><div className="pp-tabs"><Button variant="plain" className="pp-tab-active">Balance</Button><Button variant="plain">Savings</Button><Button variant="plain">Crypto</Button></div>
          <section className="pp-balance"><p>Total PayPal Balance</p><div>$30.71</div></section>
          <Button variant="paypal" onClick={openAmount}>Add Money</Button>
          <div className="pp-debit"><div className="pp-debit-heading"><PayPalMark/><strong>Debit Card</strong></div><PayPalMark colorful/><div className="pp-debit-bottom"><span>Use your balance anywhere.</span><div className="pp-mastercard"><i/><i/></div></div></div>
          <Button variant="yellow">Get a PayPal Debit Card</Button>
          <div className="pp-tax"><strong>Get your federal tax<br/>refund up to 5 days early*</strong><p>Use PayPal Direct Deposit for</p></div>
        </>}
      </div>
      <footer className="pp-footer">{screen === "home" && <div className="pp-send-actions"><Button variant="yellow">Send</Button><Button variant="yellow">Request</Button></div>}<nav>{navigation.map(({label, icon: Icon}) => <Button key={label} variant="plain" className={(screen === "home" && label === "Home") || (screen === "finances" && label === "Finances") ? "pp-nav-active" : ""} onClick={() => { if(label === "Home") setScreen("home"); if(label === "Finances") setScreen("finances"); }}><Icon/><span>{label}</span></Button>)}</nav></footer>
    </> : <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back" onClick={() => { setSheet(false); setScreen(screen === "methods" ? "amount" : "finances"); }}><ArrowLeft/></Button><span>Add money to PayPal balance</span></header>
      <div className={`pp-amount-content ${screen === "methods" ? "pp-method-content" : ""}`}><div className="pp-amount" aria-live="polite">${amount}</div>{screen === "amount" && <><p className="pp-current-balance">PayPal balance: $30.71</p>{amount === "0" && <div className="pp-presets">{[10,25,50,100].map(value => <Button key={value} variant="preset" onClick={() => chooseAmount(String(value))}>${value}</Button>)}</div>}</>}
      {screen === "methods" && <div className="pp-methods"><Button variant="method" className={method === "debit" ? "pp-selected" : ""} onClick={() => { setMethod("debit"); setSheet(true); }}><span className="pp-method-art"><FundingArt/></span><strong>in seconds</strong><span>with debit</span></Button><Button variant="method" className={method === "bank" ? "pp-selected" : ""} onClick={() => { setMethod("bank"); setSheet(false); }}><span className="pp-method-art"><FundingArt bank/></span><strong>in 3-5 days</strong><span>with your bank</span></Button></div>}
      {screen === "methods" && method === "bank" && <><div className="pp-bank-row"><BankLogo/><div><strong>DEMO BANK N.A.</strong><span>Checking ••••0000</span></div><Button variant="plain" className="pp-change" onClick={() => setSheet(true)}>Change</Button></div><div className="pp-fee"><span>Fee:</span><span>No fees</span></div></>}
      </div>
      {screen === "amount" && <div className="pp-keyboard-area">{Number(amount) > 0 && <div className="pp-continue"><Button variant="paypal" aria-label="Continue" disabled={loading} onClick={() => chooseAmount(amount)}>{loading ? <span className="pp-spinner"/> : "Next"}</Button></div>}<div className="pp-keyboard">{[{n:"1",l:""},{n:"2",l:"ABC"},{n:"3",l:"DEF"},{n:"4",l:"GHI"},{n:"5",l:"JKL"},{n:"6",l:"MNO"},{n:"7",l:"PQRS"},{n:"8",l:"TUV"},{n:"9",l:"WXYZ"},{n:".",l:""},{n:"0",l:""},{n:"delete",l:""}].map(({n,l}) => <Button key={n} variant="keypad" className={n === "." || n === "delete" ? "pp-key-transparent" : ""} aria-label={n === "delete" ? "Delete digit" : n} onClick={() => enterKey(n)}>{n === "delete" ? <Delete/> : <><span>{n}</span>{l && <small>{l}</small>}</>}</Button>)}</div></div>}
      {screen === "methods" && <div className="pp-method-footer">{method === "bank" ? <><p className="pp-disclaimer">Transfers made after 7:00 PM ET or on weekends or holidays can take a little longer. All transactions are subject to review.</p><Button variant="paypal">Add ${Number(amount).toFixed(2)} Now</Button></> : <Button variant="plain" className="pp-choose-card" onClick={() => setSheet(true)}>Choose a debit card</Button>}</div>}
      {sheet && <><div className="pp-overlay" onClick={() => setSheet(false)}/><section className="pp-sheet" role="dialog" aria-modal="true" aria-label="Choose a way to add funds"><header><h2>Choose a way to add funds</h2><Button variant="plain" size="icon" aria-label="Close" onClick={() => setSheet(false)}><X/></Button></header>{method === "bank" ? <><Button variant="plain" className="pp-sheet-bank" onClick={() => setSheet(false)}><BankLogo/><span><strong>DEMO BANK N.A.</strong><small>Checking ••••0000</small></span><Check/></Button><Button variant="plain" className="pp-link-card pp-link-bank"><span className="pp-plus"><Plus/></span><span>Link a bank account</span></Button></> : <Button variant="plain" className="pp-link-card" onClick={openLink}><span className="pp-plus"><Plus/></span><strong>Link an eligible debit card to<br/>add funds in seconds</strong></Button>}<Button variant="plain" className="pp-missing-methods">Don’t see all of your payment methods?</Button></section></>}
    </>}
    <div className={`pp-assistive ${screen === "amount" || screen === "link" ? "pp-assistive-keyboard" : ""}`} aria-hidden="true"><i/></div>
  </div></main>;
}