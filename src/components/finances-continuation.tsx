import { ArrowDownToLine, ArrowRightLeft, Banknote, CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const options = [
  { title: "Set up Direct Deposit", detail: "Up to 2 days early. Learn more", icon: CreditCard },
  { title: "Cash a check", detail: "Money in minutes for a fee", icon: Banknote },
  { title: "Add cash at stores", detail: "90,000+ participating stores", icon: Banknote },
  { title: "Transfer", detail: "From your balance", icon: ArrowRightLeft },
];

export function FinancesContinuation({ addedCents, onTransfer }: { addedCents: number | null; onTransfer: () => void }) {
  return <>
    <section className="pp-tax">
      <div className="pp-tax-copy"><strong>Get your federal tax<br/>refund up to 5 days early*</strong><p>Use PayPal Direct Deposit for<br/>your tax refund.</p></div>
      <div className="pp-deposit-art" aria-hidden="true"><div className="pp-deposit-envelope"/><div className="pp-deposit-note"><i/></div><ArrowDownToLine/></div>
      <span className="pp-deposit-link">Set up Direct Deposit</span>
    </section>
    <section className="pp-finance-options" aria-labelledby="pp-options-title">
      <h2 id="pp-options-title">More options</h2>
      <ul>{options.map(({ title, detail, icon: Icon }) => <li key={title}>{title === "Transfer" ? <Button variant="plain" className="pp-finance-transfer" onClick={onTransfer}><Icon aria-hidden="true"/><div><span>{title}</span><small>{detail}</small></div></Button> : <><Icon aria-hidden="true"/><div><span>{title}</span><small>{detail}</small></div></>}</li>)}</ul>
    </section>
    <section className="pp-finance-activity" aria-labelledby="pp-finance-activity-title">
      <h2 id="pp-finance-activity-title">Recent activity</h2>
      {addedCents !== null && <div className="pp-finance-transaction"><div className="pp-activity-card" aria-hidden="true"><CreditCard/></div><div className="pp-activity-details"><strong>MasterCard Debit Card…</strong><small>Mar 13</small><small>Transfer using card · Completed</small></div><span>+${(addedCents / 100).toFixed(0)}</span></div>}
      <div className="pp-finance-transaction"><div className="pp-activity-bank" aria-hidden="true"><Landmark/></div><div className="pp-activity-details"><strong>SUTTON BANK</strong><small>Feb 14</small><small>Transfer to bank · Completed</small></div><span>−$3</span></div>
    </section>
  </>;
}