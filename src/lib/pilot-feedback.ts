/**
 * Pilot feedback helpers for the end-of-deal-review embedded Google Form.
 * The app never submits to Google Forms itself — the iframe posts to Google.
 */

import { PILOT_FEEDBACK_PROPERTY_IDS } from "@/data/properties/catalog";

/** Google Form document id for the pilot feedback questionnaire. */
export const PILOT_FEEDBACK_FORM_ID =
  "100PIDFDsuvWrhZQShY8TTWkbp6TqdQVLzf4dKpeeWP0";

/**
 * Embedded responder URL for in-app iframe (not /preview, not the editor).
 * Submissions stay on Google Forms; the app does not read responses.
 */
export const PILOT_FEEDBACK_EMBEDDED_FORM_URL = `https://docs.google.com/forms/d/${PILOT_FEEDBACK_FORM_ID}/viewform?embedded=true`;

/** User-facing copy for pilot orientation and end-of-review feedback UI. */
export const PILOT_FEEDBACK_COPY = {
  guidance: {
    heading: "Review this Florida condo opportunity",
    body:
      "Review the recommendation, risk flags, and missing diligence for this sample property. Condo Clear offers a quick screening view for solo investors — not a CRM. When you finish, the short review questionnaire is at the bottom of this page.",
  },
  endOfReview: {
    heading: "Finish your review",
    body:
      "You’ve reviewed this sample property’s screening outcome, risks, and missing diligence. Tell us what was clear, what felt unreliable, and what you would need for a real deal. It takes about two minutes.",
    cta: "Give feedback",
  },
  modal: {
    title: "Pilot feedback",
    closeLabel: "Close feedback form",
    iframeTitle: "Florida Condo Screening MVP pilot feedback form",
  },
} as const;

/**
 * Niagara (Track) and Fowler (Pass) only — never Cypress / Sample shells.
 * In TRIAL_BUILD, Fowler remains catalog-hidden, so pilots only see this on Niagara.
 */
export function showPilotEndOfReviewFeedback(property: {
  id: string;
  isSample?: boolean;
}): boolean {
  if (property.isSample) return false;
  return PILOT_FEEDBACK_PROPERTY_IDS.has(property.id);
}

/** Same pilot examples as end-of-review feedback — Niagara and Fowler only. */
export function showPilotReviewGuidance(property: {
  id: string;
  isSample?: boolean;
}): boolean {
  return showPilotEndOfReviewFeedback(property);
}
