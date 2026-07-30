# Pilot runbook (operators)

How to run a consistent Deal Screen MVP pilot and capture usable learning.
Evaluators use the Home panel; **you** use this runbook.

Related:

- Evaluator script: Home → **How to evaluate this pilot**
- Session capture: `notes/pilot/_template.md` → `notes/pilot/sessions/YYYY-MM-DD-<slug>.md`
- Product stance: structured condo screening for a few opportunities — not a CRM

---

## 1. Purpose / success

**Learn whether the screening screen helps someone track Florida condo diligence** (Track vs Pass contrast, risk flags, missing docs) — not whether they like every UI widget.

Success signals:

- They can state Niagara as **Track** and Fowler as **Pass** in their own words
- They notice durable facts vs this-tab toggles
- Feedback answers: would this change how they track diligence?

Ignore for success: requests for boards, sharing, auth, or multi-user CRM.

---

## 2. Who to recruit

**Good fit**

- Operators who screen a **small number** of Florida condo deals
- People who already use notes/spreadsheets/memos for diligence
- Willing to spend **15–20 minutes** on a structured walkthrough

**Poor fit (politely decline or reframe)**

- Looking for a full CRM / pipeline / team collaboration tool
- Need live multi-user sync or “save deals in the cloud” today
- Only interested in marketing polish, not screening content

---

## 3. Prep (before the call)

- [ ] `TRIAL_BUILD` is `true` (`src/lib/trial-build.ts`)
- [ ] `npm run dev` (or deployed build) loads Home without Help / board / pin chrome
- [ ] Confirm deals open: Niagara (Track), Fowler (Pass); Cypress shows as Sample shell
- [ ] Open this runbook + a blank session note (copy template from Home or `_template.md`)
- [ ] Optional: mailto draft available for them; you still take structured notes

---

## 4. What to say before the session (30–60 seconds)

Use roughly this framing — then stop talking:

> This is a file-based condo **screening** tool for a few deals at a time — not a CRM or collaboration platform.  
> I’ll give you a short task. Think out loud. I won’t coach unless you’re stuck.  
> Some toggles on the screen are demo-only and don’t save. The durable facts live in the deal data file.

Do **not** pitch stub generator, status/print URLs, or hidden demo workspace tools.

---

## 5. What not to explain too early

Hold until they ask or the task is done:

- How to add a property via TypeScript / Stub generator
- That `/status` exists but is out of pilot build
- Pin, archive, board, import/export, Help tools (hidden in trial)
- Your roadmap or “we could add…”

If they wander toward Cypress as a second underwriting file, clarify once: **Sample shell only**.

---

## 6. Exact task (match Home panel)

Give this task verbatim (or point them at Home’s script):

1. Open **View properties** → **7863 Niagara Ave #1921** (**Track**).
2. Open **2200 E Fowler Ave #B12** (**Pass**).
3. On each live deal: read outcome, overview, risk flags, missing docs / known missing; skim tax, association, screening (pro forma may be unset).
4. Notice Cypress is a **Sample** identity shell — not a screening comparison.
5. Optional later: Stub generator — creates TypeScript; does not save a deal in the app.

Timebox: **15–20 minutes**. Prefer observation over tutorial.

---

## 7. Live observation prompts (silent notes)

While they work, jot:

- Where do they hesitate or misread outcome (Track vs Pass)?
- Do they treat session document toggles as “saved”?
- Do they look for CRM features (assign, share, pipeline)?
- What do they praise without prompting?

Do not rescue immediately. If stuck >60s on navigation, one nudge: “Start from Home → View properties.”

---

## 8. Questions after

Ask in this order (also on Home / mailto):

1. Would this screen change how you track condo diligence?
2. Was Track vs Pass contrast clear?
3. What was clearest / most confusing?
4. What’s missing before you’d use this on a live deal?
5. Would you use again? (Yes / No / Maybe — why?)

---

## 9. Classify feedback

Before filing the session note, tag each point:

| Class | Means | Default action |
|---|---|---|
| **Bug** | Broken / incorrect vs intended | Fix or log for fix |
| **Confusion** | Wording / IA / expectations | Copy or framing tweak |
| **Feature request** | New capability (often CRM) | Park — out of MVP scope |
| **Product insight** | Screening value / workflow truth | Keep; shapes next pilot or data depth |

Park feature requests that imply multi-user, sync, sharing, or pipeline boards.

---

## 10. File the session + follow-up

- [ ] Copy template → `notes/pilot/sessions/YYYY-MM-DD-<slug>.md`
- [ ] Fill who / task / useful / confused / use-again / screening signal / outcome
- [ ] Add a short **Classification** block (bugs / confusion / features / insights)
- [ ] Decide follow-up: none / send thank-you / schedule second probe

One file per session. Do not overwrite prior sessions. Keep property diligence in `memos/` and `notes/property-*`, not here.

---

## Operator checklist (print or tick)

- [ ] ICP fit confirmed  
- [ ] Trial build verified  
- [ ] Opening script said  
- [ ] Task given without over-coaching  
- [ ] Track vs Pass observed  
- [ ] Post questions asked  
- [ ] Feedback classified  
- [ ] Session note filed under `notes/pilot/sessions/`  
