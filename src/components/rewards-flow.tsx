import { useState } from "react";
import { ArrowLeft, Check, Fuel, Info, Plus, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoRewardEndDate, demoRewardOffers } from "@/lib/rewards-demo";

function MerchantMark({ id }: { id: string }) {
  if (id === "target") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="currentColor"/><circle className="pp-reward-logo-paper" cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7" fill="currentColor"/></svg>;
  if (id === "gas") return <Fuel/>;
  if (id === "home-depot") return <span className="pp-reward-depot">THE<br/>HOME<br/>DEPOT</span>;
  if (id === "safeway") return <span className="pp-reward-safeway">S</span>;
  if (id === "orvis") return <span className="pp-reward-wordmark">ORVIS</span>;
  if (id === "aeropostale") return <span className="pp-reward-fineprint">AEROPOSTALE</span>;
  if (id === "american-eagle") return <span className="pp-reward-fineprint">AMERICAN EAGLE</span>;
  if (id === "kroger") return <span className="pp-reward-kroger">Kroger</span>;
  return <span className="pp-reward-panera"><svg viewBox="0 0 40 26"><path d="M8 19C8 7 14 3 21 3s11 7 11 16H8Z" fill="currentColor"/><path className="pp-reward-bread-cut" d="m15 8-3 9m10-10-4 10m10-8-4 9"/></svg><span>Panera</span></span>;
}

export function RewardsFlow({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"explore" | "saved">("explore");
  const [saved, setSaved] = useState<string[]>([]);
  const [terms, setTerms] = useState(false);
  const offers = tab === "saved" ? demoRewardOffers.filter(offer => saved.includes(offer.id)) : demoRewardOffers;
  return <>
    <header className="pp-flow-header pp-reward-header"><Button variant="plain" size="icon" aria-label="Back to PayPal Debit Card" onClick={onBack}><ArrowLeft/></Button><span>Rewards</span></header>
    <div className="pp-scroll pp-reward-scroll">
      <div className="pp-reward-banner" aria-hidden="true"><span><Trophy/><i/></span></div>
      <div className="pp-reward-tabs" role="tablist" aria-label="Reward offers">
        <Button variant="plain" role="tab" id="reward-explore" aria-selected={tab === "explore"} aria-controls="reward-offers" onClick={() => setTab("explore")}>Explore</Button>
        <Button variant="plain" role="tab" id="reward-saved" aria-selected={tab === "saved"} aria-controls="reward-offers" onClick={() => setTab("saved")}>Saved</Button>
      </div>
      <section className="pp-reward-content" id="reward-offers" role="tabpanel" aria-labelledby={`reward-${tab}`}>
        <h1>{tab === "explore" ? "Today’s a good day to reward yourself" : "Saved offers"}</h1>
        <p className="pp-reward-intro">Save offers. Shop with your card. Get cash back.</p>
        <div className="pp-reward-list">{offers.map(offer => {
          const isSaved = saved.includes(offer.id);
          return <article className="pp-reward-offer" key={offer.id}>
            <span className={`pp-reward-logo pp-reward-logo-${offer.id}`} aria-hidden="true"><MerchantMark id={offer.id}/></span>
            <div><h2>{offer.name}</h2><strong>{offer.percent}% cash back</strong><small><Info/>Ends {demoRewardEndDate}</small></div>
            <Button variant="plain" size="icon" className="pp-reward-save" aria-label={`${isSaved ? "Unsave" : "Save"} ${offer.name} demo offer`} aria-pressed={isSaved} title={isSaved ? "Remove saved demo offer" : "Save demo offer"} onClick={() => setSaved(previous => isSaved ? previous.filter(id => id !== offer.id) : [...previous, offer.id])}>{isSaved ? <Check/> : <Plus/>}</Button>
          </article>;
        })}</div>
        {!offers.length && <div className="pp-reward-empty"><Trophy/><p>No saved offers yet</p></div>}
        <p className="pp-reward-legal">Eligible items only. Redeem points for cash or other options. <Button variant="plain" onClick={() => setTerms(true)}>Terms and exclusions apply.</Button></p>
        <p className="pp-reward-demo">Demo · Recorded sample offers, not current promotions. No rewards are activated or earned.</p>
      </section>
    </div>
    {terms && <><div className="pp-overlay" onClick={() => setTerms(false)}/><section className="pp-sheet pp-reward-terms" role="dialog" aria-modal="true" aria-label="Rewards demo terms"><header><h2>Rewards demo</h2><Button variant="plain" size="icon" aria-label="Close rewards terms" onClick={() => setTerms(false)}><X/></Button></header><p>These rates and March 28 end dates reproduce the recording. They are not live offers. Saving only marks a sample offer during this preview; no merchant, card, purchase, or PayPal Rewards account is connected.</p></section></>}
  </>;
}