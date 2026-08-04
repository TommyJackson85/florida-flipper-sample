# Florida Condo Screening MVP
## Development Plan / PRD

**Owner:** Thomas  
**Status:** Draft  
**Version:** 1.0  
**Build approach:** File-based TypeScript + Markdown  
**Product type:** Solo-operator screening tool, not a CRM


---

## 1. Product Summary

This product is a file-based Florida condo screening tool for a solo operator. Its job is to help a user review a small number of condo deals quickly and credibly, surface risk flags and missing diligence, and produce memo-ready notes for each property.

The MVP is intentionally narrow. It is designed for screening and diligence only, not for team collaboration, CRM workflows, or long-term deal management.

The durable source of truth is the codebase itself: TypeScript seed files for properties, Markdown for operator notes and runbooks, and trial-mode UI gates for what is visible during pilot use.


---

## 2. User

### Primary user
A solo operator or technical partner working on Florida condo deals.

### Secondary context
The user may be:
- A property investor screening acquisitions.
- A lawyer or technical operator helping review deals.
- A founder/operator testing a lightweight, file-based workflow before any real product build.

### User constraints
- Wants speed and clarity over complexity.
- Works with a small number of properties.
- Does not need multi-user collaboration for this MVP.
- Accepts that the build is file-based and that saving means editing TypeScript seed files.


---

## 3. Job To Be Done

When reviewing a condo property file, the user wants to quickly understand:
- Who owns the property.
- Whether tax or association issues exist.
- Whether key diligence documents are missing.
- Whether the deal should be tracked, passed, or treated as a sample example.
- What memo or notes should be recorded for later review.

The core question this product answers is:

**Should I keep looking at this condo deal, and why?**

The product exists to make that decision fast, credible, and easy to explain to another operator or advisor.


---

## 4. Success Criteria

The MVP is successful if a pilot user can:

- Open the app and immediately understand that it is a screening tool, not a CRM.
- Navigate from Home to Properties to a seeded deal screen without explanation.
- Review identity, tax, association, risk flags, missing documents, and sources.
- Read a memo or notes section that feels credible and useful.
- Understand Niagara’s Track outcome and open diligence without confusion.
- Complete a pilot flow in under 15 minutes.
- Give feedback about trust, clarity, workflow, or business value rather than feature breadth.

A strong result is not “more features.” A strong result is a user saying, “I would use this to screen deals.”

---

## 5. MVP Scope

### In scope
- Property list.
- Deal screen.
- Screening outcome labels (Track / Pass / Sample).
- Property snapshot and identifiers.
- Tax information.
- Association information.
- Risk flags.
- Missing documents.
- Screening gates.
- Source references.
- Memo and notes.
- Closing readiness if seeded.
- Simple milestone list.
- Trial-build mode using a feature flag such as `TRIAL_BUILD`.
- Pilot script, runbook, and session note template.

### Explicitly out of scope
- Multi-user collaboration.
- Real CRM functionality.
- Authentication or login.
- Database-backed persistence.
- File attachments and uploads.
- Full sharing workflows.
- Dashboard or analytics surfaces.
- Board or kanban views.
- Bulk actions.
- Pin, stage, tag, and archive workflows.
- AI-visible product features for pilot users.

This MVP is screening-only. Anything that does not directly support screening should stay out.

---

## 6. Product Principle

This is a screening-first product.

The main job is to help the user screen a condo deal and produce a useful memo. Everything else is secondary unless it improves screening clarity, trust, or speed.

If a feature does not help the user decide Track vs Pass faster or more confidently, it does not belong in the MVP.

---

## 7. What The App Is Today

The application is intentionally split into two layers.

### A. Visible screening MVP
What pilot users should see:
- Home thesis.
- Properties list (Niagara — Track).
- Pilot panel.
- Runbook and notes guidance.

### B. Held back from the trial
These remain in the repo for later iteration, but are not part of the pilot experience:
- Board or pipeline views.
- Pins, tags, stages, and archive controls.
- Bulk actions.
- Presets.
- Help tools for import/export.
- Diagnostics.
- Status, print, and export surfaces.
- Attachments and post-close surfaces.

The visible product should feel like a screening tool. Extra workspace tools stay out of the pilot story.

---

## 8. User Flow

### Primary pilot flow
Home → Properties → Niagara → memo / notes

### Secondary developer flow
Home → Intake / add new property file → register a new `.ts` seed file

### Not a pilot flow
- Board views.
- CRM management.
- Workspace or admin actions.
- Multi-user collaboration.
- Shared exports or document management.

The hero workflow is reading screening screens. The secondary workflow is developer file creation.

---

## 9. Trial Mode

The product should support a trial mode flag such as `TRIAL_BUILD`.

When trial mode is on:
- Extra workspace tools stay out of view.
- The deal screen is the center of the experience.
- The properties list stays simple — Niagara is the seeded deal for the pilot.
- Only screening-relevant sections remain prominent.

When trial mode is off:
- Internal workspace tools may become visible again for development.
- This does not change the MVP definition.

Trial mode exists to protect the pilot story, not to fake product maturity.

---

## 10. Data Model Approach

The MVP is file-based.

That means:
- Property data lives in TypeScript seed files.
- Narrative text and operator instructions live in Markdown.
- “Saving” a change means editing the source files.
- There is no live database in this phase.

This is a deliberate product constraint, not a temporary shortcut. The file-based model is the product.

---

## 11. Seeded Properties

### Niagara
A credible Track case — the deal used for the pilot.

Requirements:
- Realistic memo.
- Realistic risk flags.
- Missing diligence shown explicitly.
- Track outcome is believable and not overly polished.
- Feels like a real property the operator would actually keep working on.

### Other seeds (non-trial fixtures)
The repo may keep additional seed files for internal testing. They are not part of the pilot path and should not appear in trial navigation, eval scripts, or runbook tasks.

---

## 12. Messaging Rules

The app copy should consistently reinforce:
- This is for screening condo deals.
- This is not a CRM.
- This is not a team workspace.
- This is not a database-backed app yet.
- Saving means editing TypeScript files.
- The pilot build is intentionally small and honest.

If users ask for collaboration, sharing, or CRM features, those requests should be logged but not treated as MVP requirements unless they directly affect screening quality.

---

## 13. Pilot Plan

### Pilot user
Solo operator or technical partner.

### Pilot session flow
1. Explain that this is a trial build.
2. Open Home.
3. Go to Properties.
4. Open Niagara.
5. Review risk flags, missing documents, and memo.
6. Optionally show developer intake only if relevant.
7. Capture feedback in the notes template.

### What to record
- Bugs.
- Confusion or trust issues.
- Feature requests.
- Workflow or business insights.

### What to park
- CRM requests.
- Workspace requests.
- Collaboration requests.
- Dashboard requests.

Only reopen a hidden feature if it directly and strongly supports screening.

---

## 14. Runbook and Notes

The repo should include:
- `RUNBOOK.md` for launch instructions.
- `notes/pilot/TEMPLATE.md` for session notes.
- `notes/pilot/sessions/` for individual session files.

The runbook should describe:
- How to launch the trial build.
- How to flip trial mode.
- How to add a new property file.
- How to record pilot notes.

The session template should include:
- Date.
- Pilot user.
- Context.
- What they tried.
- Questions and confusions.
- Requested features.
- Bug / confusion / feature / insight classification.

---

## 15. Non-Goals

This MVP is not trying to solve:
- Team workflow management.
- Portfolio tracking.
- Deal pipeline operations.
- CRM replacement.
- Production document management.
- Persistent cloud save.
- AI-generated UI features.

Those can be future products or later phases, but they are not MVP work.

---

## 16. Risks and Caveats

### Trust risk
If seeded properties feel fake, users will not trust the screening output.

### Scope risk
It is easy to drift back into CRM behavior if workspace tools reappear in the pilot build.

### File-based friction
Editing TypeScript to save a deal is acceptable for this MVP, but must be explained clearly so users do not assume persistence exists.

### Extra-seed distraction
Additional internal seed files must stay out of the trial experience, or the pilot story gets noisy.

---

## 17. Open Questions

- Does Niagara need stronger realism before pilot?
- Should later pilots ever include a second seeded outcome for contrast?
- Which one gated feature, if any, is worth reopening after pilots?
- How much copy is needed to explain file-based saving without confusing users?

---

## 18. Decision Rule

After pilots, decide whether to:
1. Stay screening-only and deepen the data set.
2. Improve trust and clarity.
3. Reopen exactly one gated feature if it clearly supports screening.

Do not expand into CRM, auth, collaboration, or persistence unless the pilot evidence strongly proves they are necessary for the screening job.

---

## 19. Current MVP Statement

**This product is a file-based Florida condo screening MVP for a solo operator.**  
Its job is to help the user screen deals, understand risk, and write memos.  
If something does not support that job, it is out of scope for now.