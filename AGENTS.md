<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- SkillPulse is client-only: role/skill data and all scoring live in `src/lib/skillpulse.ts` as pure functions (tested in `src/test/skillpulse.test.ts`); UI components in `src/components/skillpulse/` only render. Why: keeps scoring rules testable and in one place.
- Any role resolves through `resolveRole` in `src/lib/skillpulse.ts`: saved user-defined roles take precedence, quick picks use hand-written lists, and catalog or legacy typed titles use generated lists. Why: every view uses the same skills.
- Checklist and user-defined role state persist in browser localStorage, read after mount and validated before use. Why: no accounts needed and avoids hydration mismatch.
- Four-week plans and local resume matching are pure functions in the scoring module; resume text is never stored or uploaded. Why: testable results without exposing resume content.
- Readiness uses category completion percentages, combining technical and fundamentals and normalizing only when a category is absent. Why: list length must not change a category's contribution.
