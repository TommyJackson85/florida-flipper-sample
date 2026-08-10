# Pilot session notes

Operator-facing log for early Deal Screen trials. Testers do not edit this folder —
you capture outcomes here after (or during) a session so learning is not lost.

**Start here for how to run a session:** [`RUNBOOK.md`](./RUNBOOK.md)

## Workflow

1. Follow the operator runbook (`RUNBOOK.md`).
2. Point testers at Home → **Share feedback** (Google Form when
   `NEXT_PUBLIC_PILOT_FEEDBACK_FORM_URL` is set; otherwise email draft).
3. Let the tester use **Draft feedback email** for screenshots / longer notes if useful; take your own notes live.
4. After the session, copy `notes/pilot/_template.md` into:

   `notes/pilot/sessions/YYYY-MM-DD-<slug>.md`

5. Fill who / task / useful / confused / use-again / screening signal / outcome, plus classification from the runbook.
6. Review later by reading `sessions/` — keep property diligence in `memos/` and `notes/property-*`, not here.

## Boundaries

- No app database, analytics, or in-product feedback store.
- Session-only UI toggles in the trial build are not durable product state.
- One file per pilot session; do not overwrite prior sessions.
