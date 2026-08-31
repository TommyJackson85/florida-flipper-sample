/**
 * Pilot feedback helpers for the embedded Google Form survey.
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

/** Stable page anchors for scroll + focus from feedback CTAs. */
export const PILOT_FEEDBACK_SURVEY_ID = "pilot-feedback-survey";
export const PILOT_FEEDBACK_SURVEY_HEADING_ID = "pilot-feedback-survey-heading";

/** Measured from the embedded form at common widths, plus a safety buffer. */
export const PILOT_FEEDBACK_FORM_HEIGHT_STEPS = [
  { minWidth: 720, height: 2026 },
  { minWidth: 520, height: 2100 },
  { minWidth: 430, height: 2208 },
  { minWidth: 0, height: 2380 },
] as const;

/** Pick iframe height from measured steps so the form fits without internal scroll. */
export function pilotFeedbackFormHeightForWidth(width: number): number {
  for (const step of PILOT_FEEDBACK_FORM_HEIGHT_STEPS) {
    if (width >= step.minWidth) return step.height;
  }
  return PILOT_FEEDBACK_FORM_HEIGHT_STEPS[
    PILOT_FEEDBACK_FORM_HEIGHT_STEPS.length - 1
  ].height;
}

export const PILOT_FEEDBACK_CALLOUT_HEADING =
  "Would this help on a real condo deal?";
export const PILOT_FEEDBACK_CALLOUT_BODY =
  "Help shape Condo Clear with a 45-second pilot survey.";
export const PILOT_FEEDBACK_CALLOUT_BUTTON = "Give 45-second feedback";

/** User-facing copy for pilot orientation in methodology panels. */
export const PILOT_FEEDBACK_COPY = {
  guidance: {
    heading: "Review this Florida condo sample",
    body:
      "Review the preliminary screening status, deal blockers, risk flags, and missing association documents for this sample property. Condo Clear offers a quick screening view for solo investors — not a CRM. When you finish, the short review questionnaire is at the bottom of this page.",
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
