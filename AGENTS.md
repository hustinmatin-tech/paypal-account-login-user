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
- Home-screen installability stays manifest-only (`public/manifest.webmanifest`, icons under `public/icons/`); no service worker, offline cache, or update polling unless offline use is explicitly requested. Why: preview and published installs keep updating live, and an app-shell worker strands stale caches.
