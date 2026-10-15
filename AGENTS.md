<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the recording's sequential screens in a single client-side flow at `/`; these are steps of one interaction, not separate content pages.
- Keep all reference styling in global semantic design tokens and button variants so every screen shares the same visual system.
- The reference balance and funding flow is a visual recreation only; never initiate real financial transactions from its controls.
- Card-linking previews use a fixed sample card and a visible demo label; never capture entered card digits or billing details, so the recreation cannot collect financial credentials.
- Security-check screens are client-side simulations with a fixed masked sample phone; never send verification texts, collect codes, or claim actual identity verification, so the reference remains a safe demonstration.
- Demo funding completion changes only in-memory balance cents after Done; reset on reload and never persist or call financial services, keeping simulated balances distinct from real funds.
- Keep the Finances continuation in a focused presentational component; its funding activity receives only in-memory demo amounts from the flow so the recording's post-completion activity never implies a real transaction.
- Keep the latest completed demo transfer separate from its dismissible notice and pass it to Finances activity; clearing the notice preserves activity while reload clears both, matching the recorded continuation without persistence.
- Keep bank-transfer previews and confirmation in a focused client-side component; return only an in-memory demo receipt to Finances and never deduct funds or contact financial services, so the recorded completion remains clearly simulated.
- Derive displayed transfer fees and net amounts from one client-side calculation, and restore the standard sample destination when switching speeds; this keeps the recording's preview consistent without moving funds.
- Transfer editing uses the shared keypad styles and keeps the last instant sample destination in component memory; this matches editing and speed switching without persisting financial data.
- Home-screen installability stays manifest-only (`public/manifest.webmanifest`, icons under `public/icons/`); no service worker, offline cache, or update polling unless offline use is explicitly requested. Why: preview and published installs keep updating live, and an app-shell worker strands stale caches.
- Keep crypto in a focused client-side flow at `/` with fixed illustrative quotes and in-memory holdings; never connect wallets, collect addresses, verify identities, or execute trades. Why: the reference is a clearly labeled visual demonstration, not a financial service.
- Keep Savings in a focused client-side flow at `/`, with balances and goals owned by the parent flow and integer-cent movements validated by one pure calculation; never open accounts, accrue interest, schedule transfers, persist data, or contact financial services. Why: navigating tabs must preserve only the current preview's simulated funds without representing real deposits.
- Keep recorded Rewards in a focused client-side component with sample offer data and in-memory save toggles only; never activate merchant offers, connect accounts, or earn rewards. Why: the continuation remains a visual demonstration rather than a financial service.
- Keep the recorded "Add cash at a store" screen a focused client-side demo with fixed sample stores and fees; never generate barcodes, locate stores, or move money. Why: the recording is a visual continuation, not a cash-loading service.
