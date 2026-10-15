import { useState } from "react";
import { ArrowLeft, ChevronRight, Info, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

type DemoStore = { id: string; name: string; fee: string };

const demoStores: DemoStore[] = [
  { id: "walmart", name: "Walmart", fee: "$3.74 fee" },
  { id: "cvs", name: "CVS/Pharmacy", fee: "$3.95 fee" },
  { id: "dollar-general", name: "Dollar General", fee: "$3.95 fee" },
  { id: "walgreens", name: "Walgreens", fee: "$3.95 fee" },
  { id: "meijer", name: "Meijer", fee: "$3.95 fee" },
  { id: "caseys", name: "Casey's", fee: "$3.95 fee" },
  { id: "duane-reade", name: "Duane Reade", fee: "$3.95 fee" },
];

function StoreMark({ id }: { id: string }) {
  switch (id) {
    case "walmart":
      return <span className="pp-store-mark pp-store-walmart" aria-hidden="true"><svg viewBox="0 0 24 24"><g fill="currentColor">{[0, 60, 120, 180, 240, 300].map(a => <rect key={a} x="10.9" y="2" width="2.2" height="6.4" rx="1.1" transform={`rotate(${a} 12 12)`}/>)}</g></svg></span>;
    case "cvs":
      return <span className="pp-store-mark pp-store-cvs" aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-7.5-4.6-9.3-9C1.3 8.6 3.2 5.5 6.4 5.5c2 0 3.6 1.1 4.4 2.7h2.4c.8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.1 3.1 3.7 6.5-1.8 4.4-9.3 9-9.3 9z"/><text x="12" y="14.5" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fff">CVS</text></svg></span>;
    case "dollar-general":
      return <span className="pp-store-mark pp-store-dg" aria-hidden="true">DG</span>;
    case "walgreens":
      return <span className="pp-store-mark pp-store-walgreens" aria-hidden="true">W</span>;
    case "meijer":
      return <span className="pp-store-mark pp-store-meijer" aria-hidden="true">meijer</span>;
    case "caseys":
      return <span className="pp-store-mark pp-store-caseys" aria-hidden="true">Casey's</span>;
    default:
      return <span className="pp-store-mark pp-store-duane" aria-hidden="true">DR</span>;
  }
}

export function AddCashStores({ onBack }: { onBack: () => void }) {
  const [notice, setNotice] = useState("");
  const demoNotice = (store: string) => setNotice(`Demo only · No barcode created for ${store}. No money added.`);
  return <>
    <header className="pp-flow-header"><Button variant="plain" size="icon" aria-label="Back" onClick={onBack}><ArrowLeft/></Button><span>Add cash at a store</span><Button variant="plain" className="pp-store-map" onClick={() => setNotice("Demo only · Store map is not available in this preview.")}>Map</Button></header>
    <div className="pp-store-scroll">
      <div className="pp-store-hero" aria-hidden="true"><Store/></div>
      <p className="pp-store-intro">Choose a store below to create a barcode. You won't pay the fee until you add money at a store.</p>
      <p className="pp-store-limits"><Info aria-hidden="true"/><span>Daily limit: $1,500 | Monthly limit: $5,000 | Transaction limit: $20 to $500</span></p>
      <ul className="pp-store-list">
        {demoStores.map(store => <li key={store.id}><Button variant="plain" className="pp-store-row" onClick={() => demoNotice(store.name)}><StoreMark id={store.id}/><span className="pp-store-name">{store.name}</span><span className="pp-store-fee">{store.fee}</span><ChevronRight aria-hidden="true"/></Button></li>)}
      </ul>
      {notice && <p className="pp-store-notice" role="status">{notice}</p>}
      <p className="pp-store-demo">Demo only · Sample stores and fees. No barcode is generated and no money moves.</p>
    </div>
  </>;
}
