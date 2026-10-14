import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Banknote, ChartNoAxesColumnIncreasing, House, Wallet, Gift, Trophy, ScanLine, X, Plus, Delete, Landmark, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundingArt } from "@/components/funding-art";
import { FinancesContinuation } from "@/components/finances-continuation";
import { TransferConfirmation, TransferMenu, TransferPreview, type DemoTransferReceipt } from "@/components/transfer-preview";

type Screen = "home" | "finances" | "amount" | "methods" | "link" | "card-summary" | "security" | "confirmed" | "complete" | "transfer" | "debit-card" | "shipping" | "card-ordered";
const sampleCard = "5555555555554444";

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
  const [linked, setLinked] = useState(false);
  const [linkedNotice, setLinkedNotice] = useState(false);
  const [demoVerified, setDemoVerified] = useState(false);
  const [balanceCents, setBalanceCents] = useState(3071);
  const [addedCents, setAddedCents] = useState<number | null>(null);
  const [transferMenu, setTransferMenu] = useState(false);
  const [transferReceipt, setTransferReceipt] = useState<DemoTransferReceipt | null>(null);
  const [receiptDetails, setReceiptDetails] = useState(false);
  const financesScroll = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useEffect(() => {
    if (screen === "finances" && financesScroll.current) financesScroll.current.scrollTop = savedScroll.current;
  }, [screen, receiptDetails]);
  const balance = (balanceCents / 100).toFixed(2);
  useEffect(() => {
    if (screen !== "confirmed") return;
    const timer = window.setTimeout(() => { setDemoVerified(true); setScreen("methods"); }, 1600);
    return () => window.clearTimeout(timer);
  }, [screen]);
  const addDemoMoney = () => {
    if (method !== "debit" || !linked) return;
    setLinkedNotice(false);
    if (!demoVerified) { setScreen("security"); return; }
    setScreen("complete");
  };
  const finishDemo = () => {
    const cents = Math.round(Number(amount) * 100);
    setBalanceCents(previous => previous + cents);
    setAddedCents(cents);
    setScreen("finances");
  };
  const openLink = () => { setSheet(false); setCard(""); setScreen("link"); };
  // The keypad reveals a fixed test card; user-entered financial data is never captured.
  const cardKey = (key: string) => setCard(p => key === "delete" ? p.slice(0, -1) : sampleCard.slice(0, Math.min(16, p.length + 1)));
  const linkSampleCard = () => { setLinked(true); setLinkedNotice(true); setMethod("debit"); setScreen("methods"); setSheet(false); };
  useEffect(() => { if (card.length === 16 && screen === "link") setScreen("card-summary"); }, [card, screen]);
  useEffect(() => {
    if (!linkedNotice) return;
    const timer = window.setTimeout(() => setLinkedNotice(false), 4500);
    return () => window.clearTimeout(timer);
  }, [linkedNotice]);

  const openAmount = () => { setAmount("0"); setScreen("amount"); };
  const chooseAmount = (value: string) => {
    setAmount(value); setLoading(true);
    window.setTimeout(() => { setLoading(false); setScreen("methods"); setMethod("debit"); setSheet(!linked); }, 450);
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
    <div className="pp-demo-label">Demo · Sample card only · No real transactions</div>
    {receiptDetails && transferReceipt ? <TransferConfirmation receipt={transferReceipt} onDone={() => setReceiptDetails(false)}/> : screen === "transfer" ? <TransferPreview balanceCents={balanceCents} onClose={() => setScreen("finances")} onDone={receipt => { setTransferReceipt(receipt); setBalanceCents(previous => Math.max(0, previous - receipt.cents)); setScreen("finances"); }}/> : screen === "debit-card" ? <>
      <header className="pp-security-header pp-header-right"><span/><Button variant="plain" size="icon" aria-label="Close debit card offer" onClick={() => setScreen("finances")}><X/></Button></header>
      <div className="pp-scroll pp-promo-scroll">
        <div className="pp-promo-hero" aria-hidden="true"><div className="pp-promo-hills"/><div className="pp-promo-card"><div className="pp-debit pp-promo-debit"><div className="pp-debit-heading"><PayPalMark/><strong>Debit Card</strong></div><PayPalMark colorful/><div className="pp-debit-bottom"><span>Use your balance anywhere.</span><div className="pp-mastercard"><i/><i/></div></div></div></div></div>
        <section className="pp-promo-body">
          <h1>Shop your favorite stores.<br/>Pay with your balance.</h1>
          <ul className="pp-promo-points"><li>Discover exclusive cash back offers</li><li>Get cash at ATMs</li><li>No monthly fees, no credit check</li><li>Shop with this card today</li></ul>
          <p className="pp-promo-legal">The PayPal Debit Mastercard® is issued by The Bancorp Bank, N.A. pursuant to a license by Mastercard International Incorporated. This is a debit card linked to your PayPal Balance account and is not a credit card. PayPal is not a bank and does not itself take deposits. Deals may change and are subject to availability. A PayPal Balance account is required to get the card.</p>
          <p className="pp-promo-legal">Demo only · This offer screen is a visual recreation. No card is ordered and no application is submitted.</p>
        </section>
      </div>
      <div className="pp-complete-footer"><Button variant="paypal" disabled={loading} onClick={() => { setLoading(true); window.setTimeout(() => { setLoading(false); setScreen("shipping"); }, 700); }}>{loading ? <span className="pp-spinner"/> : "Get Your PayPal Debit Card"}</Button></div>
    </> : screen === "shipping" ? <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back" onClick={() => setScreen("debit-card")}><ArrowLeft/></Button><span>Confirm shipping address</span></header>
      <div className="pp-scroll pp-ship"><h1>Where we’ll ship your card</h1><div className="pp-ship-address" aria-label="Sample address">Sample address</div><Button variant="plain" className="pp-ship-add"><Plus/>Add a new address</Button><p className="pp-promo-legal">Demo only · No card is ordered or shipped.</p></div>
      <div className="pp-complete-footer"><Button variant="paypal" onClick={() => setScreen("card-ordered")}>Confirm</Button></div>
    </> : screen === "card-ordered" ? <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back" onClick={() => setScreen("finances")}><ArrowLeft/></Button><span>PayPal Debit Card</span></header>
      <div className="pp-scroll pp-ordered">
        <div className="pp-ordered-card"><div className="pp-debit-heading"><PayPalMark/><small>Debit Card</small></div><span className="pp-ordered-badge">Ordered</span><strong>${balance}</strong><p>Available PayPal balance</p><PayPalMark colorful/><div className="pp-ordered-bottom"><span>◉ •• 2593</span><div className="pp-mastercard"><i/><i/></div></div></div>
        <div className="pp-ordered-note"><strong>Card ordered</strong><p>We’ll email you when it ships. You can use your digital PayPal Debit Card to shop now.</p><small>Demo only · No card was actually ordered</small></div>
        <Button variant="paypal" onClick={openAmount}>Add Money</Button>
        <div className="pp-offers"><div><h2>New cash back offers</h2><p>Start getting cash back at your favorite places. Terms Apply.</p><span className="pp-deposit-link">Explore offers</span></div><span className="pp-offer-art" aria-hidden="true">🎁</span></div>
        <p className="pp-rewards-link">About PayPal Rewards</p>
        <div className="pp-ordered-tabs"><span className="active">Activity</span><span>Manage</span></div>
        <div className="pp-keep-track"><span aria-hidden="true">🧾</span><div><strong>Keep track easily</strong><p>New transactions will pop up here</p></div></div>
      </div>
    </> : screen === "complete" ? <>
      <section className="pp-money-complete" aria-live="polite"><div className="pp-confirmation-check" aria-hidden="true"><Check/></div><h1>You added ${Number(amount).toFixed(2)} to<br/>your balance</h1><p>Demo balance only · No money moved</p></section>
      <div className="pp-complete-footer"><Button variant="paypal" onClick={finishDemo}>Done</Button></div>
    </> : screen === "security" || screen === "confirmed" ? <>
      <header className="pp-security-header"><Button variant="plain" size="icon" aria-label="Close security check" onClick={() => setScreen("methods")}><X/></Button><span>PayPal</span></header>
      {screen === "security" ? <section className="pp-security-content">
        <PayPalMark/>
        <h1>Quick security check</h1>
        <p className="pp-security-intro">We just need some additional info to<br/>confirm it’s you.</p>
        <label className="pp-text-option"><input type="radio" name="verification" checked readOnly/><span>Receive a text</span></label>
        <div className="pp-demo-mobile"><span>Mobile</span><span>••• ••• 0100 (sample)</span></div>
        <p className="pp-security-consent">By continuing, you confirm that you are authorized to use this phone number and agree to receive text messages to confirm your identity in this session. Carrier fees may apply.</p>
        <Button variant="paypal" onClick={() => setScreen("confirmed")}>Next</Button>
      </section> : <>
        <section className="pp-confirmation" aria-live="polite"><div className="pp-confirmation-check" aria-hidden="true"><Check/></div><h1>Identity confirmed!</h1><p>Redirecting…<br/>Demo only · No identity verification performed</p></section>
        <footer className="pp-security-footer"><PayPalMark/><div><span>Contact Us</span><span>Privacy</span><span>Legal</span><span>Worldwide</span></div></footer>
      </>}
    </> : screen === "card-summary" ? <>
      <header className="pp-link-header"><Button variant="plain" size="icon" aria-label="Close" onClick={() => { setScreen("methods"); setSheet(!linked); }}><X/></Button><div><span>Mastercard</span><small>Visa or Mastercard only</small></div></header>
      <div className="pp-card-summary"><div className="pp-card-art pp-summary-art" aria-hidden="true"><div className="pp-mastercard"><i/><i/></div></div><div className="pp-summary-number">•••• •••• •••• 4444</div><div className="pp-summary-meta"><span>Expires 12/30</span><span>•••</span></div><div className="pp-billing-address"><div><small>Billing address</small><span>Sample address</span></div><ChevronRight/></div></div>
      <Button variant="paypal" className="pp-link-submit" onClick={linkSampleCard}>Link Card</Button>
    </> : screen === "link" ? <>
      <header className="pp-link-header"><Button variant="plain" size="icon" aria-label="Close" onClick={() => { setScreen("methods"); setSheet(true); }}><X/></Button><div><span>Link a debit card</span><small>Visa or Mastercard only</small></div></header>
      <div className="pp-link-content"><div className="pp-card-art" aria-hidden="true"><i/><i/><b/></div><p>Let’s start with a sample number.</p><div className="pp-card-input">{card ? (card.match(/\d{1,4}/g) ?? []).join(" ") : null}<span className="pp-caret"/>{!card && <span className="pp-card-placeholder">Sample debit card number</span>}</div><Button variant="plain" className="pp-scan" onClick={() => { setCard(sampleCard); setScreen("card-summary"); }}>Use sample card</Button></div>
      <div className="pp-keyboard-area"><div className="pp-keyboard">{[{n:"1",l:""},{n:"2",l:"ABC"},{n:"3",l:"DEF"},{n:"4",l:"GHI"},{n:"5",l:"JKL"},{n:"6",l:"MNO"},{n:"7",l:"PQRS"},{n:"8",l:"TUV"},{n:"9",l:"WXYZ"},{n:"",l:""},{n:"0",l:""},{n:"delete",l:""}].map(({n,l},i) => n === "" ? <span key={`gap-${i}`}/> : <Button key={n} variant="keypad" className={n === "delete" ? "pp-key-transparent" : ""} aria-label={n === "delete" ? "Delete digit" : n} onClick={() => cardKey(n)}>{n === "delete" ? <Delete/> : <><span>{n}</span>{l && <small>{l}</small>}</>}</Button>)}</div></div>
    </> : (screen === "home" || screen === "finances") ? <>
      <div className="pp-scroll" ref={financesScroll}>
        {screen === "home" ? <>
          <header className="pp-home-header"><div className="pp-avatar"> </div><div><Button variant="plain" size="icon" aria-label="Rewards"><Trophy/></Button><Button variant="plain" size="icon" aria-label="Scan"><ScanLine/></Button></div></header>
          <div className="pp-accounts"><div className="pp-account" onClick={() => setScreen("finances")}><PayPalMark/><p>PayPal balance</p><strong>${balance}</strong><Button variant="plain" onClick={event => { event.stopPropagation(); openAmount(); }}>Add money</Button></div><div className="pp-account"><Banknote className="pp-savings-icon"/><p>PayPal Savings</p><strong>$0.00</strong><div className="pp-apy">↑ APY: <span>4.00%</span></div></div></div>
          <div className="pp-setup"><div className="pp-progress">4/5</div><div><strong>Set up your account</strong><p>You're almost done!</p></div></div>
          {cryptoBanner && <div className="pp-crypto"><span className="pp-crypto-art">💸</span><div><strong>Move crypto your way—<br/>Send. Receive. Enjoy.</strong><p>Terms apply.</p></div><Button variant="plain" size="icon" aria-label="Dismiss crypto banner" onClick={() => setCryptoBanner(false)}><X/></Button></div>}
          <section className="pp-activity"><h2>Recent activity</h2><div className="pp-transaction"><div className="pp-bank"><Landmark/></div><div><strong>SUTTON BANK</strong><p>Feb 14</p><p>Transfer to bank · Completed</p></div></div></section>
        </> : <>
          <h1 className="pp-title">Finances</h1><div className="pp-tabs"><Button variant="plain" className="pp-tab-active">Balance</Button><Button variant="plain">Savings</Button><Button variant="plain">Crypto</Button></div>
          <section className="pp-balance"><p>Total PayPal Balance</p><div>${balance}</div></section>
          <Button variant="paypal" onClick={openAmount}>Add Money</Button>
          <div className="pp-debit"><div className="pp-debit-heading"><PayPalMark/><strong>Debit Card</strong></div><PayPalMark colorful/><div className="pp-debit-bottom"><span>Use your balance anywhere.</span><div className="pp-mastercard"><i/><i/></div></div></div>
          <Button variant="yellow" onClick={() => { savedScroll.current = financesScroll.current?.scrollTop ?? 0; setScreen("debit-card"); }}>Get a PayPal Debit Card</Button>
            <FinancesContinuation addedCents={addedCents} onTransfer={() => { savedScroll.current = financesScroll.current?.scrollTop ?? 0; setTransferMenu(true); }}/>
        </>}
      </div>
      <footer className="pp-footer">{screen === "home" && <div className="pp-send-actions"><Button variant="yellow">Send</Button><Button variant="yellow">Request</Button></div>}<nav>{navigation.map(({label, icon: Icon}) => <Button key={label} variant="plain" className={(screen === "home" && label === "Home") || (screen === "finances" && label === "Finances") ? "pp-nav-active" : ""} onClick={() => { if(label === "Home") setScreen("home"); if(label === "Finances") setScreen("finances"); }}><Icon/><span>{label}</span></Button>)}</nav></footer>
    </> : <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back" onClick={() => { setSheet(false); setScreen(screen === "methods" ? "amount" : "finances"); }}><ArrowLeft/></Button><span>Add money to PayPal balance</span></header>
      <div className={`pp-amount-content ${screen === "methods" ? "pp-method-content" : ""}`}>{screen === "methods" && linkedNotice ? <div className="pp-linked-notice" role="status"><Check/><span>You linked sample Mastercard Debit<br/>••••4444</span></div> : <div className="pp-amount" aria-live="polite">${amount}</div>}{screen === "amount" && <><p className="pp-current-balance">PayPal balance: ${balance}</p>{amount === "0" && <div className="pp-presets">{[10,25,50,100].map(value => <Button key={value} variant="preset" onClick={() => chooseAmount(String(value))}>${value}</Button>)}</div>}</>}
      {screen === "methods" && <div className="pp-methods"><Button variant="method" className={method === "debit" ? "pp-selected" : ""} onClick={() => { setMethod("debit"); setSheet(true); }}><span className="pp-method-art"><FundingArt/></span><strong>in seconds</strong><span>with debit</span></Button><Button variant="method" className={method === "bank" ? "pp-selected" : ""} onClick={() => { setMethod("bank"); setSheet(false); }}><span className="pp-method-art"><FundingArt bank/></span><strong>in 3-5 days</strong><span>with your bank</span></Button></div>}
      {screen === "methods" && method === "bank" && <><div className="pp-bank-row"><BankLogo/><div><strong>DEMO BANK N.A.</strong><span>Checking ••••0000</span></div><Button variant="plain" className="pp-change" onClick={() => setSheet(true)}>Change</Button></div><div className="pp-fee"><span>Fee:</span><span>No fees</span></div></>}
      {screen === "methods" && method === "debit" && linked && <><div className="pp-bank-row"><div className="pp-mastercard pp-row-mastercard" aria-hidden="true"><i/><i/></div><div><strong>Mastercard</strong><span>Sample debit ••••4444</span></div><Button variant="plain" className="pp-change" onClick={() => setSheet(true)}>Change</Button></div><div className="pp-fee"><span>Fee:</span><span>No fees</span></div></>}
      </div>
      {screen === "amount" && <div className="pp-keyboard-area">{Number(amount) > 0 && <div className="pp-continue"><Button variant="paypal" aria-label="Continue" disabled={loading} onClick={() => chooseAmount(amount)}>{loading ? <span className="pp-spinner"/> : "Next"}</Button></div>}<div className="pp-keyboard">{[{n:"1",l:""},{n:"2",l:"ABC"},{n:"3",l:"DEF"},{n:"4",l:"GHI"},{n:"5",l:"JKL"},{n:"6",l:"MNO"},{n:"7",l:"PQRS"},{n:"8",l:"TUV"},{n:"9",l:"WXYZ"},{n:".",l:""},{n:"0",l:""},{n:"delete",l:""}].map(({n,l}) => <Button key={n} variant="keypad" className={n === "." || n === "delete" ? "pp-key-transparent" : ""} aria-label={n === "delete" ? "Delete digit" : n} onClick={() => enterKey(n)}>{n === "delete" ? <Delete/> : <><span>{n}</span>{l && <small>{l}</small>}</>}</Button>)}</div></div>}
      {screen === "methods" && <div className="pp-method-footer">{method === "bank" || linked ? <><p className="pp-disclaimer">{method === "bank" ? "Transfers made after 7:00 PM ET or on weekends or holidays can take a little longer. All transactions are subject to review." : "Applies only to Visa or Mastercard debit cards. Transactions are subject to review. We may delay or decline a transaction if we identify an issue."}</p><Button variant="paypal" onClick={addDemoMoney}>Add ${Number(amount).toFixed(2)} Now</Button></> : <Button variant="plain" className="pp-choose-card" onClick={() => setSheet(true)}>Choose a debit card</Button>}</div>}
      {sheet && <><div className="pp-overlay" onClick={() => setSheet(false)}/><section className="pp-sheet" role="dialog" aria-modal="true" aria-label="Choose a way to add funds"><header><h2>Choose a way to add funds</h2><Button variant="plain" size="icon" aria-label="Close" onClick={() => setSheet(false)}><X/></Button></header>{method === "bank" ? <><Button variant="plain" className="pp-sheet-bank" onClick={() => setSheet(false)}><BankLogo/><span><strong>DEMO BANK N.A.</strong><small>Checking ••••0000</small></span><Check/></Button><Button variant="plain" className="pp-link-card pp-link-bank"><span className="pp-plus"><Plus/></span><span>Link a bank account</span></Button></> : <Button variant="plain" className="pp-link-card" onClick={openLink}><span className="pp-plus"><Plus/></span><strong>Link an eligible debit card to<br/>add funds in seconds</strong></Button>}<Button variant="plain" className="pp-missing-methods">Don’t see all of your payment methods?</Button></section></>}
    </>}
    {transferMenu && screen === "finances" && <TransferMenu onClose={() => setTransferMenu(false)} onBank={() => { setTransferMenu(false); setScreen("transfer"); }}/>}
    {transferReceipt && screen === "finances" && !receiptDetails && <><div className="pp-overlay"/><section className="pp-transfer-alert" role="alertdialog" aria-modal="true" aria-labelledby="pp-transfer-alert-title"><h2 id="pp-transfer-alert-title">PayPal</h2><p>You transferred ${(transferReceipt.cents / 100).toFixed(2)} USD to {transferReceipt.destination === "capital" ? "CAPITAL ONE N.A. (1200)" : transferReceipt.destination === "mastercard" ? "Mastercard Debit (4444)" : "SUTTON BANK (0000)"}. It arrived instantly.</p><small>Demo only · No money moved</small><div><Button variant="plain" onClick={() => setTransferReceipt(null)}>Done</Button><Button variant="plain" onClick={() => setReceiptDetails(true)}>View Details</Button></div></section></>}
    <div className={`pp-assistive ${screen === "amount" || screen === "link" ? "pp-assistive-keyboard" : ""}`} aria-hidden="true"><i/></div>
  </div></main>;
}