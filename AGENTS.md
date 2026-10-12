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
- Keep bank-transfer previews in a focused client-side component receiving the in-memory balance; transfer actions only display a demo notice and never deduct funds or contact financial services.
- Derive displayed transfer fees and net amounts from one client-side calculation, and restore the standard sample destination when switching speeds; this keeps the recording's preview consistent without moving funds.
- Home-screen installability stays manifest-only (`public/manifest.webmanifest`, icons under `public/icons/`); no service worker, offline cache, or update polling unless offline use is explicitly requested. Why: preview and published installs keep updating live, and an app-shell worker strands stale caches.
