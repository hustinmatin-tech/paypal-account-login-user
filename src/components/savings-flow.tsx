import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Delete, Info, Plus, Target, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bucketCents, moveDemoSavings, savingsTotal, type SavingsBucket, type SavingsState } from "@/lib/savings-demo";

type Step = "overview" | "detail" | "goal" | "amount" | "review" | "complete";
const money = (cents: number) => (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
export function SavingsFlow({ savings, balanceCents, onUpdate, onExit, onCrypto, renderNavigation }: {
  savings: SavingsState; balanceCents: number;
  onUpdate: (savings: SavingsState, balanceCents: number) => void;
  onExit: () => void; onCrypto: () => void; renderNavigation: () => ReactNode;
}) {
  const [step, setStep] = useState<Step>("overview");
  const [selected, setSelected] = useState<SavingsBucket>("general");
  const [action, setAction] = useState<"add" | "transfer">("add");
  const [from, setFrom] = useState<SavingsBucket>("balance");
  const [to, setTo] = useState<SavingsBucket>("general");
  const [draft, setDraft] = useState("0");
  const [frequency, setFrequency] = useState("One-time");
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [newGoal, setNewGoal] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [activity, setActivity] = useState<{ cents: number; label: string; bucket: SavingsBucket }[]>([]);
  const [receipt, setReceipt] = useState("");
  const label = (bucket: SavingsBucket) => bucket === "balance" ? "PayPal balance" : bucket === "general" ? "General Savings" : savings.goals.find(goal => goal.id === bucket)?.name ?? goalName.trim();
  const selectedGoal = savings.goals.find(goal => goal.id === selected);
  const cents = Math.round(Number(draft) * 100);
  const available = bucketCents(savings, balanceCents, from);
  const valid = Number.isSafeInteger(cents) && cents > 0 && cents <= available && from !== to;
  const targetCents = goalTarget === "" ? 0 : Math.round(Number(goalTarget) * 100);
  const goalValid = goalName.trim().length > 0 && Number.isSafeInteger(targetCents) && targetCents >= 0;
  const begin = (next: "add" | "transfer", bucket: SavingsBucket) => {
    setAction(next); setDraft("0"); setFrequency("One-time"); setNewGoal(false);
    setFrom(next === "add" ? "balance" : bucket); setTo(next === "add" ? bucket : "balance"); setStep("amount");
  };
  const key = (value: string) => setDraft(previous => {
    if (value === "delete") return previous.length > 1 ? previous.slice(0, -1) : "0";
    if (value === ".") return previous.includes(".") ? previous : previous + ".";
    if (previous.length >= 8 || previous.split(".")[1]?.length === 2) return previous;
    return previous === "0" ? value : previous + value;
  });
  const finish = () => {
    if (!valid) return;
    const state = newGoal ? { ...savings, goals: [...savings.goals, { id: Number(to), name: goalName.trim(), targetCents, cents: 0 }] } : savings;
    const result = moveDemoSavings(state, balanceCents, from, to, cents);
    if (!result) return;
    onUpdate(result.savings, result.balanceCents);
    setReceipt(`${money(cents)} ${action === "add" ? `added to ${label(to)}` : `transferred to ${label(to)}`}`);
    setActivity(previous => [{ cents, label: `${action === "add" ? "Added from" : "Transfer to"} ${label(action === "add" ? from : to)}`, bucket: action === "add" ? to : from }, ...previous]);
    setStep("complete");
  };
  const goalRows = savings.goals.map(goal => <Button variant="plain" className="pp-savings-bucket" key={goal.id} onClick={() => { setSelected(goal.id); setStep("detail"); }}><span className="pp-savings-symbol"><Target/></span><span><strong>{goal.name}</strong><small>{goal.targetCents > 0 ? `${money(goal.cents)} of ${money(goal.targetCents)}` : money(goal.cents)}</small>{goal.targetCents > 0 && <progress value={goal.cents} max={Math.max(goal.cents, goal.targetCents)} aria-label={`${goal.name} progress`}/>}</span><ChevronRight/></Button>);
  const history = (bucket?: SavingsBucket) => {
    const rows = activity.filter(item => bucket === undefined || item.bucket === bucket);
    return <section className="pp-savings-history"><h2>Recent activity</h2>{rows.length ? rows.map((item, index) => <div key={index}><span><strong>{item.label}</strong><small>Demo · Completed</small></span><strong>{money(item.cents)}</strong></div>) : <div className="pp-savings-empty"><TrendingUp/><p>No activity yet</p></div>}</section>;
  };
  const back = () => {
    if (step === "review") setStep("amount");
    else if (step === "amount" && newGoal) setStep("goal");
    else setStep("overview");
  };
  return <>
    {step === "overview" ? <>
      <div className="pp-scroll pp-savings-scroll">
        <h1 className="pp-title">Finances</h1><div className="pp-tabs"><Button variant="plain" onClick={onExit}>Balance</Button><Button variant="plain" className="pp-tab-active" aria-pressed>Savings</Button><Button variant="plain" onClick={onCrypto}>Crypto</Button></div>
        <section className="pp-savings-summary"><div><p>Total savings</p><Button variant="plain" size="icon" aria-label="About PayPal Savings" onClick={() => setInfo("About PayPal Savings")}><Info/></Button></div><h2>{money(savingsTotal(savings))}</h2><Button variant="plain" className="pp-savings-rate" onClick={() => setInfo("Annual Percentage Yield")}><TrendingUp/>4.00% APY <Info/></Button><small>Illustrative rate · Demo only</small></section>
        <div className="pp-savings-interest"><div><span>Pending interest</span><strong>$0.00</strong></div><div><span>Lifetime interest</span><strong>$0.00</strong></div></div>
        <Button variant="paypal" onClick={() => begin("add", "general")}>Add Money</Button>
        <Button variant="plain" className="pp-savings-balance-card" onClick={onExit} aria-label={`PayPal balance ${money(balanceCents)}`}>
          <span className="pp-savings-card-heading"><svg className="paypal-mark" viewBox="0 0 80 90" aria-hidden="true"><path className="p-back" d="M19 8h30c25 0 30 13 25 30-4 16-17 23-36 23h-9l-4 22H8z"/><path className="p-front" d="M31 27h25c19 0 25 10 21 24-4 14-15 21-31 21h-8l-4 18H20z"/><path className="p-overlap" d="M31 27h25c8 0 14 2 18 5-3 20-16 29-36 29h-13z"/></svg><span>PayPal balance</span><ChevronRight/></span>
          <strong aria-live="polite">{money(balanceCents)}</strong><small>Available demo balance</small>
        </Button>
        <section className="pp-savings-buckets"><Button variant="plain" className="pp-savings-bucket" onClick={() => { setSelected("general"); setStep("detail"); }}><span className="pp-savings-symbol"><TrendingUp/></span><span><strong>General Savings</strong><small>{money(savings.generalCents)}</small></span><ChevronRight/></Button><div className="pp-savings-section-title"><h2>Your goals</h2><Button variant="plain" aria-label="Create a new goal" onClick={() => { setGoalName(""); setGoalTarget(""); setStep("goal"); }}><Plus/></Button></div>{goalRows}{!savings.goals.length && <p className="pp-savings-hint">Save for something special.</p>}<Button variant="plain" className="pp-savings-link" onClick={() => { setGoalName(""); setGoalTarget(""); setStep("goal"); }}><Plus/>Create a new goal</Button></section>
        {history()}<p className="pp-savings-legal">PayPal Savings is provided by Synchrony Bank, Member FDIC. This recreation is not a bank account. Demo funds earn no interest and are not deposits.</p>
      </div>{renderNavigation()}
    </> : <>
      <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back from savings" onClick={back}><ArrowLeft/></Button><span>{step === "detail" ? label(selected) : step === "goal" ? "Create a new goal" : step === "complete" ? "PayPal Savings" : action === "add" ? "Add money to Savings" : "Transfer from Savings"}</span></header>
      {step === "detail" ? <div className="pp-scroll pp-savings-detail"><div className="pp-savings-detail-title"><h1>{label(selected)}</h1><Button variant="plain" onClick={() => setInfo("Manage savings")}>Manage</Button></div><div className="pp-savings-large">{money(bucketCents(savings, balanceCents, selected))}</div>{selectedGoal && selectedGoal.targetCents > 0 && <p className="pp-savings-hint">of {money(selectedGoal.targetCents)} goal</p>}<p className="pp-savings-rate">4.00% APY · Illustrative</p><div className="pp-savings-detail-actions"><Button variant="paypal" onClick={() => begin("add", selected)}><Plus/>Add Money</Button><Button variant="outline" onClick={() => begin("transfer", selected)}><ArrowUpRight/>Transfer</Button></div>{history(selected)}</div>
      : step === "goal" ? <><div className="pp-scroll pp-savings-form"><Target className="pp-savings-goal-art"/><h1>What are you saving for?</h1><label>Goal name<input maxLength={40} value={goalName} onChange={event => setGoalName(event.target.value)} placeholder="e.g., Vacation" autoComplete="off"/></label><label>Target amount (optional)<input type="number" min="0" max="999999" step="0.01" inputMode="decimal" value={goalTarget} onChange={event => setGoalTarget(event.target.value)} placeholder="$0.00"/></label></div><div className="pp-complete-footer"><Button variant="paypal" disabled={!goalValid} onClick={() => { const id = Math.max(0, ...savings.goals.map(goal => goal.id)) + 1; setTo(id); setFrom("balance"); setNewGoal(true); setAction("add"); setDraft("0"); setFrequency("One-time"); setStep("amount"); }}>Next</Button></div></>
      : step === "amount" ? <><div className="pp-scroll pp-savings-amount"><h1>{action === "add" ? "How much do you want to add?" : "How much do you want to transfer?"}</h1><div className="pp-savings-large" aria-live="polite">${draft}</div><p>{money(available)} available in {label(from)}</p><label className="pp-savings-select">{action === "add" ? "To" : "From"}<select aria-label={action === "add" ? "Savings destination" : "Savings source"} value={action === "add" ? to : from} disabled={newGoal} onChange={event => { const value = event.target.value === "general" ? "general" : Number(event.target.value); if (action === "add") setTo(value); else setFrom(value); }}><option value="general">General Savings</option>{savings.goals.map(goal => <option key={goal.id} value={goal.id}>{goal.name}</option>)}{newGoal && <option value={to}>{goalName.trim()}</option>}</select></label>{action === "add" && <label className="pp-savings-select">How often<select value={frequency} onChange={event => setFrequency(event.target.value)}>{["One-time", "Weekly", "Every 2 weeks", "Monthly"].map(value => <option key={value}>{value}</option>)}</select></label>}{Number(draft) > 0 && !valid && <p role="status">Not enough demo funds for this amount.</p>}</div><div className="pp-continue"><Button variant="paypal" disabled={!valid} onClick={() => setStep("review")}>Review</Button></div><div className="pp-keyboard-area pp-savings-keypad"><div className="pp-keyboard">{["1","2","3","4","5","6","7","8","9",".","0","delete"].map(value => <Button variant="keypad" key={value} aria-label={value === "delete" ? "Delete savings digit" : value} onClick={() => key(value)}>{value === "delete" ? <Delete/> : value}</Button>)}</div></div></>
      : step === "review" ? <><div className="pp-scroll pp-savings-review"><h1>Review your {action === "add" ? "transfer" : "withdrawal"}</h1><div className="pp-savings-large">{money(cents)}</div><dl><div><dt>From</dt><dd>{label(from)}</dd></div><div><dt>To</dt><dd>{label(to)}</dd></div>{action === "add" && <div><dt>How often</dt><dd>{frequency}</dd></div>}<div><dt>Arrival</dt><dd>In seconds · Demo</dd></div><div><dt>Fee</dt><dd>$0.00</dd></div></dl><p className="pp-savings-legal">Demo only. No deposit, withdrawal, or recurring transfer will be submitted. Only this preview’s sample balances change.</p></div><div className="pp-complete-footer"><Button variant="paypal" onClick={finish}>{action === "add" ? "Add Money" : "Transfer"} · Demo</Button></div></>
      : <><section className="pp-savings-complete" aria-live="polite"><div className="pp-confirmation-check"><Check/></div><h1>{receipt}</h1><p>Demo complete · No real money moved.</p>{frequency !== "One-time" && <small>No recurring transfer was created.</small>}</section><div className="pp-complete-footer"><Button variant="paypal" onClick={() => { setNewGoal(false); setStep("overview"); }}>Done</Button></div></>}
    </>}
    {info && <><div className="pp-overlay" onClick={() => setInfo(null)}/><section className="pp-sheet pp-savings-sheet" role="dialog" aria-modal="true" aria-label={info}><header><h2>{info}</h2><Button variant="plain" size="icon" aria-label="Close savings information" onClick={() => setInfo(null)}><X/></Button></header><p>{info === "Annual Percentage Yield" ? "APY means Annual Percentage Yield. The 4.00% figure is an illustrative reference, not a current offer or a verified rate for every date in 2025. Actual rates are variable. No interest accrues in this demo." : info === "Manage savings" ? "Your demo savings and goals are held only while this page is open. Recurring transfers, account applications, statements, and account settings are not connected." : "PayPal Savings is provided by Synchrony Bank, Member FDIC. This is an independent visual demonstration, not PayPal or a real savings account. No financial information is collected."}</p></section></>}
  </>;
}