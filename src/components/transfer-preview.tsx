import { useState } from "react";
import { ArrowRightLeft, Check, Globe, Landmark, Pencil, Wallet, X } from "lucide-react";
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
  const [notice, setNotice] = useState(false);
  const cents = Math.round(Number(amount) * 100);
  const valid = Number.isFinite(cents) && cents > 0 && cents <= balanceCents;
  const fee = speed === "instant" ? Math.max(25, Math.round(cents * 0.0175)) : 0;
  return <>
    <header className="pp-security-header"><Button variant="plain" size="icon" aria-label="Close transfer amount" onClick={onClose}><X/></Button><span>Transfer amount</span></header>
    <section className="pp-transfer-content">
      <div className="pp-transfer-amount">{editing ? <label><span>$</span><input aria-label="Transfer amount" inputMode="decimal" autoFocus value={amount} onChange={event => { if (/^\d{0,6}(\.\d{0,2})?$/.test(event.target.value)) { setAmount(event.target.value); setNotice(false); } }} onBlur={() => { if (valid) { setAmount((cents / 100).toFixed(2)); setEditing(false); } }}/></label> : <Button variant="plain" onClick={() => setEditing(true)} aria-label="Edit transfer amount"><span>${amount}</span><Pencil/></Button>}</div>
      <p className="pp-transfer-available">Available balance: ${balance}</p>
      <div className="pp-methods pp-transfer-methods">
        <Button variant="method" className={speed === "instant" ? "pp-selected" : ""} onClick={() => { setSpeed("instant"); setNotice(false); }}><span className="pp-method-art"><FundingArt/></span><strong>in minutes</strong><span>{(Math.max(25, Math.round(cents * 0.0175)) / 100).toFixed(2)} USD fee</span></Button>
        <Button variant="method" className={speed === "standard" ? "pp-selected" : ""} onClick={() => { setSpeed("standard"); setNotice(false); }}><span className="pp-method-art"><FundingArt bank/></span><strong>in 1-3 days</strong><span>No fee</span></Button>
      </div>
      <div className="pp-bank-row"><div className="pp-transfer-bank-art"><Landmark/></div><div><strong>SUTTON BANK</strong><span>Checking ••••0000 (sample)</span></div><Button variant="plain" className="pp-change" onClick={() => setBankSheet(true)}>Change</Button></div>
      <div className="pp-fee"><span>Fee:</span><span>{fee === 0 ? "Free" : `$${(fee / 100).toFixed(2)}`}</span></div>
      <p className="pp-disclaimer pp-transfer-disclaimer">Transfers made after 7:00 PM ET or on weekends or holidays can take a little longer. All transfers are subject to review and might be delayed or stopped if there’s an issue.</p>
      {notice && <p className="pp-transfer-notice" role="status">Demo only · No transfer made. Your balance is unchanged.</p>}
    </section>
    <div className="pp-complete-footer"><Button variant="paypal" disabled={!valid} onClick={() => setNotice(true)}>Transfer ${(valid ? cents / 100 : 0).toFixed(2)} USD Now</Button></div>
    {bankSheet && <><div className="pp-overlay" onClick={() => setBankSheet(false)}/><section className="pp-sheet" role="dialog" aria-modal="true" aria-label="Choose a sample bank"><header><h2>Choose a sample bank</h2><Button variant="plain" size="icon" aria-label="Close bank selection" onClick={() => setBankSheet(false)}><X/></Button></header><Button variant="plain" className="pp-sheet-bank" onClick={() => setBankSheet(false)}><Landmark/><span><strong>SUTTON BANK</strong><small>Checking ••••0000 (sample)</small></span><Check/></Button></section></>}
  </>;
}