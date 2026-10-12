import { useState } from "react";
import { ArrowRightLeft, Globe, Landmark, Pencil, Plus, Wallet, X } from "lucide-react";
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

export function TransferPreview({ balanceCents, onClose }: { balanceCents: number; onClose: () => void }) {
  const balance = (balanceCents / 100).toFixed(2);
  const [amount, setAmount] = useState(balance);
  const [speed, setSpeed] = useState<"standard" | "instant">("standard");
  const [editing, setEditing] = useState(false);
  const [bankSheet, setBankSheet] = useState(false);
  const [destination, setDestination] = useState<"sutton" | "mastercard" | "capital">("sutton");
  const [sheetNotice, setSheetNotice] = useState("");
  const [notice, setNotice] = useState(false);
  const cents = Math.round(Number(amount) * 100);
  const valid = Number.isFinite(cents) && cents > 0 && cents <= balanceCents;
  const instantFee = Number.isFinite(cents) ? Math.min(2500, Math.max(25, Math.round(cents * 0.0175))) : 25;
  const fee = speed === "instant" ? instantFee : 0;
  const netCents = valid ? Math.max(0, cents - fee) : 0;
  return <>
    <header className="pp-security-header"><Button variant="plain" size="icon" aria-label="Close transfer amount" onClick={onClose}><X/></Button><span>Transfer amount</span></header>
    <section className="pp-transfer-content">
      <div className="pp-transfer-amount">{editing ? <label><span>$</span><input aria-label="Transfer amount" inputMode="decimal" autoFocus value={amount} onChange={event => { if (/^\d{0,6}(\.\d{0,2})?$/.test(event.target.value)) { setAmount(event.target.value); setNotice(false); } }} onBlur={() => { if (valid) { setAmount((cents / 100).toFixed(2)); setEditing(false); } }}/></label> : <Button variant="plain" onClick={() => setEditing(true)} aria-label="Edit transfer amount"><span>${amount}</span><Pencil/></Button>}</div>
      <p className="pp-transfer-available">Available balance: ${balance}</p>
      <div className="pp-methods pp-transfer-methods">
        <Button variant="method" className={speed === "instant" ? "pp-selected" : ""} onClick={() => { setSpeed("instant"); setNotice(false); setSheetNotice(""); setBankSheet(true); }}><span className="pp-method-art"><FundingArt/></span><strong>in minutes</strong><span>${(instantFee / 100).toFixed(2)} USD fee</span></Button>
        <Button variant="method" className={speed === "standard" ? "pp-selected" : ""} onClick={() => { setSpeed("standard"); setDestination("sutton"); setNotice(false); setBankSheet(false); }}><span className="pp-method-art"><FundingArt bank/></span><strong>in 1-3 days</strong><span>No fee</span></Button>
      </div>
      <div className="pp-bank-row">{destination === "mastercard" ? <div className="pp-mastercard pp-row-mastercard" aria-hidden="true"><i/><i/></div> : destination === "capital" ? <div className="pp-capital-logo" aria-hidden="true">Capital One</div> : <div className="pp-transfer-bank-art"><Landmark/></div>}<div><strong>{destination === "mastercard" ? "Mastercard" : destination === "capital" ? "CAPITAL ONE N.A." : "SUTTON BANK"}</strong><span>{destination === "mastercard" ? "Debit ••••4444 (sample)" : "Checking ••••0000 (sample)"}</span></div><Button variant="plain" className="pp-change" onClick={() => { setSheetNotice(""); setBankSheet(true); }}>Change</Button></div>
      <div className="pp-fee pp-transfer-fee"><span>Fee:</span><span>{fee === 0 ? "Free" : `$${(fee / 100).toFixed(2)} USD`}</span>{speed === "instant" && <small>1.75% fee ($0.25 USD minimum,<br/>$25.00 USD maximum)</small>}</div>
      <p className="pp-disclaimer pp-transfer-disclaimer">{speed === "instant" ? "Transfers may take a few minutes and vary by bank. All transfers are subject to review and could be delayed or stopped if we identify an issue." : "Transfers made after 7:00 PM ET or on weekends or holidays can take a little longer. All transfers are subject to review and might be delayed or stopped if there’s an issue."}</p>
      {notice && <p className="pp-transfer-notice" role="status">Demo only · No transfer made. Your balance is unchanged.</p>}
    </section>
    <div className="pp-complete-footer"><Button variant="paypal" disabled={!valid || netCents === 0} onClick={() => setNotice(true)}>Transfer ${(netCents / 100).toFixed(2)} USD Now</Button></div>
    {bankSheet && <><div className="pp-overlay" onClick={() => setBankSheet(false)}/><section className="pp-sheet pp-destination-sheet" role="dialog" aria-modal="true" aria-label="Transfer to" onKeyDown={event => { if (event.key === "Escape") setBankSheet(false); }}>
      <Button variant="plain" className="pp-sheet-handle" aria-label="Close transfer destinations" onClick={() => setBankSheet(false)}><span/></Button>
      <h2>Transfer to</h2>
      <Button variant="plain" className="pp-destination-row" onClick={() => { setDestination("mastercard"); setSpeed("instant"); setBankSheet(false); setNotice(false); }}><span className="pp-destination-card" aria-hidden="true"><span className="pp-mastercard"><i/><i/></span></span><span><strong>Mastercard</strong><small>Debit ••••4444 (sample)</small></span></Button>
      <Button variant="plain" className="pp-destination-row" onClick={() => { setDestination("capital"); setBankSheet(false); setNotice(false); }}><span className="pp-capital-logo" aria-hidden="true">Capital One</span><span><strong>CAPITAL ONE N.A.</strong><small>Checking ••••0000 (sample)</small></span></Button>
      <Button variant="plain" className="pp-destination-link" onClick={() => setSheetNotice("Demo only · Sample debit card available above. No card details collected.")}><span className="pp-destination-plus"><Plus/></span><span>Link a new debit card</span></Button>
      <Button variant="plain" className="pp-destination-link" onClick={() => setSheetNotice("Demo only · Sample bank available above. No bank details collected.")}><span className="pp-destination-plus"><Plus/></span><span>Link a new bank account</span></Button>
      <Button variant="plain" className="pp-missing-methods" onClick={() => setSheetNotice("Demo only · These are the available sample banks and cards.")}>Don’t see all of your banks and cards?</Button>
      {sheetNotice && <p className="pp-destination-notice" role="status">{sheetNotice}</p>}
    </section></>}
  </>;
}