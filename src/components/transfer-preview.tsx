import { useEffect, useState } from "react";
import { ArrowRightLeft, Check, Delete, Globe, Landmark, Pencil, Plus, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundingArt } from "@/components/funding-art";

export function TransferMenu({ onClose, onBank }: { onClose: () => void; onBank: () => void }) {
  return <><div className="pp-overlay" onClick={onClose}/><section className="pp-sheet pp-transfer-sheet" role="dialog" aria-modal="true" aria-label="Transfer Money">
    <header><h2>Transfer Money</h2><Button variant="plain" size="icon" aria-label="Close transfer menu" onClick={onClose}><X/></Button></header>
    <Button variant="plain" className="pp-transfer-option" onClick={onBank}><ArrowRightLeft/><span>Transfer to bank</span></Button>
    <div className="pp-transfer-option"><Wallet/><span>Transfer to PayPal Savings</span></div>
    <div className="pp-transfer-option"><Globe/><span>Transfer internationally</span></div>
  </section></>;
}

export type DemoTransfer = { cents: number; destination: string };

export function TransferPreview({ balanceCents, onClose, onDone }: { balanceCents: number; onClose: () => void; onDone: (transfer: DemoTransfer) => void }) {
  const balance = (balanceCents / 100).toFixed(2);
  const [amount, setAmount] = useState(balance);
  const [speed, setSpeed] = useState<"standard" | "instant">("standard");
  const [editing, setEditing] = useState(false);
  const [bankSheet, setBankSheet] = useState(false);
  const [destination, setDestination] = useState<"sutton" | "mastercard" | "capital">("sutton");
  const [instantDestination, setInstantDestination] = useState<"mastercard" | "capital" | null>(null);
  const [sheetNotice, setSheetNotice] = useState("");
  const [notice, setNotice] = useState(false);
  const [completed, setCompleted] = useState<DemoTransfer | null>(null);
  const cents = Math.round(Number(amount) * 100);
  const valid = Number.isFinite(cents) && cents > 0 && cents <= balanceCents;
  const instantFee = Number.isFinite(cents) ? Math.min(2500, Math.max(25, Math.round(cents * 0.0175))) : 25;
  const fee = speed === "instant" ? instantFee : 0;
  const netCents = valid ? Math.max(0, cents - fee) : 0;
  const destinationName = destination === "mastercard" ? "Mastercard" : destination === "capital" ? "CAPITAL ONE N.A." : "SUTTON BANK";
  const finishEditing = () => {
    if (!valid) return;
    setAmount((cents / 100).toFixed(2));
    setEditing(false);
  };
  const enterKey = (key: string) => {
    setNotice(false);
    setAmount(previous => {
      if (key === "delete") return previous.length > 1 ? previous.slice(0, -1) : "0";
      if (key === ".") return previous.includes(".") ? previous : previous + ".";
      if (!/^[0-9]$/.test(key)) return previous;
      const [whole = "", fraction] = previous.split(".");
      if (fraction !== undefined ? fraction.length >= 2 : whole.length >= 6) return previous;
      return previous === "0" ? key : previous + key;
    });
  };
  useEffect(() => {
    if (!editing) return;
    const onKey = (event: KeyboardEvent) => {
      if (/^[0-9.]$/.test(event.key) || event.key === "Backspace") {
        event.preventDefault();
        enterKey(event.key === "Backspace" ? "delete" : event.key);
      }
      if (event.key === "Enter") { event.preventDefault(); finishEditing(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, amount, valid]);
  if (completed) return <>
    <header className="pp-security-header pp-transfer-complete-header"><Button variant="plain" size="icon" aria-label="Close transfer confirmation" onClick={() => onDone(completed)}><X/></Button></header>
    <section className="pp-transfer-complete" aria-live="polite"><div className="pp-confirmation-check" aria-hidden="true"><Check/></div><h1>Your ${(completed.cents / 100).toFixed(2)} USD is on<br/>its way!</h1><p>Demo only · No transfer made.<br/>Your balance is unchanged.</p><Button variant="paypal" onClick={() => onDone(completed)}>Done</Button></section>
  </>;
  return <>
    <header className="pp-security-header"><Button variant="plain" size="icon" aria-label="Close transfer amount" onClick={onClose}><X/></Button><span>Transfer amount</span></header>
    <section className={`pp-transfer-content ${editing ? "pp-transfer-editing" : ""}`}>
      <div className="pp-transfer-amount">{editing ? <div className="pp-transfer-draft" role="textbox" aria-label="Transfer amount" aria-readonly="true" tabIndex={0}><span>${amount}</span><span className="pp-caret"/></div> : <Button variant="plain" onClick={() => { setEditing(true); setNotice(false); }} aria-label="Edit transfer amount"><span>${amount}</span><Pencil/></Button>}</div>
      <p className="pp-transfer-available">Available balance: ${balance}</p>
      <div className="pp-methods pp-transfer-methods">
        <Button variant="method" className={speed === "instant" ? "pp-selected" : ""} onClick={() => { setSpeed("instant"); setNotice(false); setSheetNotice(""); if (instantDestination) setDestination(instantDestination); else setBankSheet(true); }}><span className="pp-method-art"><FundingArt/></span><strong>in minutes</strong><span>${(instantFee / 100).toFixed(2)} USD fee</span></Button>
        <Button variant="method" className={speed === "standard" ? "pp-selected" : ""} onClick={() => { setSpeed("standard"); setDestination("sutton"); setNotice(false); setBankSheet(false); }}><span className="pp-method-art"><FundingArt bank/></span><strong>in 1-3 days</strong><span>No fee</span></Button>
      </div>
      <div className="pp-bank-row">{destination === "mastercard" ? <div className="pp-mastercard pp-row-mastercard" aria-hidden="true"><i/><i/></div> : destination === "capital" ? <div className="pp-capital-logo" aria-hidden="true">Capital One</div> : <div className="pp-transfer-bank-art"><Landmark/></div>}<div><strong>{destination === "mastercard" ? "Mastercard" : destination === "capital" ? "CAPITAL ONE N.A." : "SUTTON BANK"}</strong><span>{destination === "mastercard" ? "Debit ••••4444 (sample)" : "Checking ••••0000 (sample)"}</span></div><Button variant="plain" className="pp-change" onClick={() => { setSheetNotice(""); setBankSheet(true); }}>Change</Button></div>
      {!editing && <><div className="pp-fee pp-transfer-fee"><span>Fee:</span><span>{fee === 0 ? "Free" : `$${(fee / 100).toFixed(2)} USD`}</span>{speed === "instant" && <small>1.75% fee ($0.25 USD minimum,<br/>$25.00 USD maximum)</small>}</div>
      <p className="pp-disclaimer pp-transfer-disclaimer">{speed === "instant" ? "Transfers may take a few minutes and vary by bank. All transfers are subject to review and could be delayed or stopped if we identify an issue." : "Transfers made after 7:00 PM ET or on weekends or holidays can take a little longer. All transfers are subject to review and might be delayed or stopped if there’s an issue."}</p>
      {notice && <p className="pp-transfer-notice" role="status">Demo only · No transfer made. Your balance is unchanged.</p>}</>}
    </section>
    {editing ? <div className="pp-keyboard-area pp-transfer-keyboard"><div className="pp-keyboard-done"><Button variant="plain" disabled={!valid} onClick={finishEditing}>Done</Button></div><div className="pp-keyboard">{[{n:"1",l:""},{n:"2",l:"ABC"},{n:"3",l:"DEF"},{n:"4",l:"GHI"},{n:"5",l:"JKL"},{n:"6",l:"MNO"},{n:"7",l:"PQRS"},{n:"8",l:"TUV"},{n:"9",l:"WXYZ"},{n:".",l:""},{n:"0",l:""},{n:"delete",l:""}].map(({n,l}) => <Button key={n} variant="keypad" className={n === "." || n === "delete" ? "pp-key-transparent" : ""} aria-label={n === "delete" ? "Delete transfer digit" : n} onClick={() => enterKey(n)}>{n === "delete" ? <Delete/> : <><span>{n}</span>{l && <small>{l}</small>}</>}</Button>)}</div></div> : <div className="pp-complete-footer"><Button variant="paypal" disabled={!valid || netCents === 0} onClick={() => setCompleted({ cents: netCents, destination: destinationName })}>Transfer ${(netCents / 100).toFixed(2)} USD Now</Button></div>}
    {bankSheet && <><div className="pp-overlay" onClick={() => setBankSheet(false)}/><section className="pp-sheet pp-destination-sheet" role="dialog" aria-modal="true" aria-label="Transfer to" onKeyDown={event => { if (event.key === "Escape") setBankSheet(false); }}>
      <Button variant="plain" className="pp-sheet-handle" aria-label="Close transfer destinations" onClick={() => setBankSheet(false)}><span/></Button>
      <h2>Transfer to</h2>
      {speed === "instant" ? <Button variant="plain" className="pp-destination-row" onClick={() => { setDestination("mastercard"); setInstantDestination("mastercard"); setBankSheet(false); setNotice(false); }}><span className="pp-destination-card" aria-hidden="true"><span className="pp-mastercard"><i/><i/></span></span><span><strong>Mastercard</strong><small>Debit ••••4444 (sample)</small></span></Button> : <Button variant="plain" className="pp-destination-row" onClick={() => { setDestination("sutton"); setBankSheet(false); }}><span className="pp-transfer-bank-art" aria-hidden="true"><Landmark/></span><span><strong>SUTTON BANK</strong><small>Checking ••••0000 (sample)</small></span>{destination === "sutton" && <Check className="pp-destination-check"/>}</Button>}
      <Button variant="plain" className="pp-destination-row" onClick={() => { setDestination("capital"); if (speed === "instant") setInstantDestination("capital"); setBankSheet(false); setNotice(false); }}><span className="pp-capital-logo" aria-hidden="true">Capital One</span><span><strong>CAPITAL ONE N.A.</strong><small>Checking ••••0000 (sample)</small></span>{speed === "standard" && destination === "capital" && <Check className="pp-destination-check"/>}</Button>
      {speed === "instant" && <Button variant="plain" className="pp-destination-link" onClick={() => setSheetNotice("Demo only · Sample debit card available above. No card details collected.")}><span className="pp-destination-plus"><Plus/></span><span>Link a new debit card</span></Button>}
      <Button variant="plain" className="pp-destination-link" onClick={() => setSheetNotice("Demo only · Sample bank available above. No bank details collected.")}><span className="pp-destination-plus"><Plus/></span><span>Link a new bank account</span></Button>
      {speed === "instant" && <Button variant="plain" className="pp-missing-methods" onClick={() => setSheetNotice("Demo only · These are the available sample banks and cards.")}>Don’t see all of your banks and cards?</Button>}
      {sheetNotice && <p className="pp-destination-notice" role="status">{sheetNotice}</p>}
    </section></>}
  </>;
}